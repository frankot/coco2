import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";
import Apaczka from "@/lib/apaczka";

function mapApaczkaToLocal(status?: string | null) {
  if (!status) return null;
  const st = String(status).toUpperCase();
  if (["CANCELLED", "CANCELED", "ANULOWANE"].includes(st)) return "CANCELLED" as const;
  if (["DELIVERED"].includes(st)) return "DELIVERED" as const;
  if (["SHIPPED", "IN_TRANSIT", "AWAITING_DELIVERY"].includes(st)) return "SHIPPED" as const;
  if (["NEW", "CREATED", "PENDING", "PROCESSING"].includes(st)) return "PROCESSING" as const;
  return null;
}

export const POST = createRouteHandler(
  async () => {
    const orders = await prisma.order.findMany({
      where: {
        apaczkaOrderId: { not: null },
        status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } as any,
      },
      select: { id: true, apaczkaOrderId: true, status: true },
    });

    const results: { id: string; ok: boolean; error?: string; newStatus?: string }[] = [];

    for (const o of orders) {
      try {
        const ap = await Apaczka.getOrder(String(o.apaczkaOrderId));
        const order = (ap as any).response?.order ?? (ap as any).order ?? (ap as any).response;
        const localStatus = mapApaczkaToLocal(order?.status) ?? o.status;
        await prisma.order.update({
          where: { id: o.id },
          data: {
            apaczkaStatus: order?.status ?? undefined,
            apaczkaWaybillNumber: order?.waybill_number ?? undefined,
            apaczkaTrackingUrl: order?.tracking_url ?? undefined,
            status: localStatus as any,
          },
        });
        results.push({ id: o.id, ok: true, newStatus: String(localStatus) });
      } catch (e: any) {
        // Log detailed error server-side for debugging
        console.error(`Apaczka sync failed for order ${o.id} (apaczkaId=${o.apaczkaOrderId}):`, e);
        results.push({ id: o.id, ok: false, error: e?.message || String(e) });
      }
    }

    return { success: true, results, count: results.length };
  },
  { auth: "admin" }
);
