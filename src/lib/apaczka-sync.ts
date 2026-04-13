import prisma from "@/db";
import Apaczka from "@/lib/apaczka";
import { sendOrderShippedEmail } from "@/lib/order-emails";

function mapApaczkaToLocal(status?: string | null) {
  if (!status) return null;
  const st = String(status).toUpperCase();
  if (["CANCELLED", "CANCELED", "ANULOWANE"].includes(st))
    return "CANCELLED" as const;
  if (["DELIVERED"].includes(st)) return "DELIVERED" as const;
  if (["SHIPPED", "IN_TRANSIT", "AWAITING_DELIVERY"].includes(st))
    return "SHIPPED" as const;
  if (["NEW", "CREATED", "PENDING", "PROCESSING"].includes(st))
    return "PROCESSING" as const;
  return null;
}

export async function syncApaczkaStatuses() {
  const orders = await prisma.order.findMany({
    where: {
      apaczkaOrderId: { not: null },
      status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } as any,
    },
    select: { id: true, apaczkaOrderId: true, status: true },
  });

  const results: {
    id: string;
    ok: boolean;
    error?: string;
    newStatus?: string;
  }[] = [];

  for (const o of orders) {
    try {
      const ap = await Apaczka.getOrder(String(o.apaczkaOrderId));
      const order =
        (ap as any).response?.order ?? (ap as any).order ?? (ap as any).response;
      const localStatus = mapApaczkaToLocal(order?.status) ?? o.status;
      const updated = await prisma.order.update({
        where: { id: o.id },
        data: {
          apaczkaStatus: order?.status ?? undefined,
          apaczkaWaybillNumber: order?.waybill_number ?? undefined,
          apaczkaTrackingUrl: order?.tracking_url ?? undefined,
          status: localStatus as any,
        },
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          orderItems: {
            select: {
              quantity: true,
              pricePerItemInCents: true,
              product: { select: { name: true } },
            },
          },
        },
      });

      if (o.status !== "SHIPPED" && localStatus === "SHIPPED") {
        sendOrderShippedEmail({
          id: updated.id,
          paymentMethod: updated.paymentMethod,
          pricePaidInCents: updated.pricePaidInCents,
          subtotalInCents: updated.subtotalInCents,
          shippingCostInCents: updated.shippingCostInCents,
          discountAmountInCents: updated.discountAmountInCents,
          apaczkaTrackingUrl: updated.apaczkaTrackingUrl,
          apaczkaWaybillNumber: updated.apaczkaWaybillNumber,
          shippingServiceName: updated.shippingServiceName,
          user: updated.user,
          orderItems: updated.orderItems,
        }).catch((error) => {
          console.error("[EMAIL] Failed to send shipped email from sync", {
            orderId: updated.id,
            error,
          });
        });
      }

      results.push({ id: o.id, ok: true, newStatus: String(localStatus) });
    } catch (e: any) {
      console.error(
        `Apaczka sync failed for order ${o.id} (apaczkaId=${o.apaczkaOrderId}):`,
        e
      );
      results.push({ id: o.id, ok: false, error: e?.message || String(e) });
    }
  }

  return { success: true, results, count: results.length };
}
