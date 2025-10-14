import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import prisma from "@/db";
import Apaczka from "@/lib/apaczka";

type Body = { orderIds?: string[]; generateTurnIn?: boolean; limit?: number };

export const POST = createRouteHandler(
  async ({ req }) => {
    const { orderIds, generateTurnIn = true, limit = 100 } = await readJson<Body>(req);

    const where = {
      id: orderIds && orderIds.length ? { in: orderIds } : undefined,
      apaczkaOrderId: null as any,
      status: { in: ["PENDING", "PROCESSING"] } as any,
      shippingServiceId: { not: null } as any,
    };

    const orders = await prisma.order.findMany({
      where: where as any,
      include: { user: true, shippingAddress: true },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    const created: { id: string; apaczkaOrderId: string }[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const order of orders) {
      try {
        const address = order.shippingAddress;
        const receiver = {
          country_code: "PL",
          name:
            `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() || order.user.email,
          line1: address?.street ?? "",
          line2: "",
          postal_code: address?.postalCode ?? "",
          state_code: "",
          city: address?.city ?? "",
          is_residential: 1,
          contact_person:
            `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() || order.user.email,
          email: order.user.email,
          phone: address?.phoneNumber ?? "",
          foreign_address_id: "",
        };

        const requiredSender = [
          "SENDER_NAME",
          "SENDER_CONTACT_PERSON",
          "SENDER_EMAIL",
          "SENDER_PHONE",
          "SENDER_LINE1",
          "SENDER_CITY",
          "SENDER_POSTAL_CODE",
        ];
        const missing = requiredSender.filter((k) => !(process.env as any)[k]);
        if (missing.length)
          throw new ApiError(`Brak konfiguracji nadawcy: ${missing.join(", ")}`, 400);

        const SENDER = {
          country_code: process.env.SENDER_COUNTRY_CODE || "PL",
          name: process.env.SENDER_NAME!,
          line1: process.env.SENDER_LINE1!,
          line2: process.env.SENDER_LINE2 || "",
          postal_code: process.env.SENDER_POSTAL_CODE!,
          state_code: process.env.SENDER_STATE_CODE || "",
          city: process.env.SENDER_CITY!,
          is_residential: 0,
          contact_person: process.env.SENDER_CONTACT_PERSON!,
          email: process.env.SENDER_EMAIL!,
          phone: process.env.SENDER_PHONE!,
          foreign_address_id: "",
        };

        const apOrder = {
          service_id: Number(order.shippingServiceId),
          address: { sender: SENDER, receiver },
          shipment_value: order.subtotalInCents,
          pickup: {
            type: "SELF",
            date: new Date().toISOString().slice(0, 10),
            hours_from: "09:00",
            hours_to: "17:00",
          },
          shipment: [
            {
              dimension1: 30,
              dimension2: 20,
              dimension3: 10,
              weight: 2,
              is_nstd: 0,
              shipment_type_code: "PACZKA",
            },
          ],
          comment: `Zamówienie [${order.id}]`,
          content: `Szkło! Proszę nie rzucać!`,
          is_zebra: 0,
        };

        const res = await Apaczka.sendOrder(apOrder);
        const ap = res.response.order;
        await prisma.order.update({
          where: { id: order.id },
          data: {
            apaczkaOrderId: String(ap.id),
            apaczkaWaybillNumber: ap.waybill_number,
            apaczkaTrackingUrl: ap.tracking_url,
            apaczkaStatus: ap.status,
            shippingServiceName: ap.service_name,
            apaczkaConfirmedAt: new Date(),
            status: "PROCESSING",
          },
        });
        created.push({ id: order.id, apaczkaOrderId: String(ap.id) });
      } catch (e: any) {
        failed.push({ id: order.id, error: e?.message || String(e) });
      }
    }

    let turnIn: string | undefined;
    if (generateTurnIn && created.length) {
      const ids = await prisma.order.findMany({
        where: { id: { in: created.map((c) => c.id) } },
        select: { apaczkaOrderId: true },
      });
      const apIds = ids.map((x) => x.apaczkaOrderId).filter(Boolean) as string[];
      if (apIds.length) {
        try {
          const resp = await Apaczka.turnIn(apIds);
          turnIn = resp.response.turn_in;
        } catch {}
      }
    }

    return { success: true, created, failed, turnIn };
  },
  { auth: "admin" }
);
