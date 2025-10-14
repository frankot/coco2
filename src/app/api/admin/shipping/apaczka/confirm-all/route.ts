import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import prisma from "@/db";
import Apaczka from "@/lib/apaczka";
import mailer from "@/lib/mailer";
function normalizePhonePL(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  const digits = input.replace(/\D+/g, "");
  if (digits.length === 9) return "+48" + digits;
  if (digits.length === 11 && digits.startsWith("48")) return "+" + digits;
  if (digits.length === 12 && digits.startsWith("0048")) return "+" + digits.slice(2);
  if (input.startsWith("+48") && digits.length === 11) return input;
  return input;
}

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
      console.log(
        "Confirm-all: order",
        order.id,
        "apaczkaPointId=",
        order.apaczkaPointId,
        "supplier=",
        order.apaczkaPointSupplier,
        "serviceId=",
        order.shippingServiceId,
        "phone=",
        order.shippingAddress?.phoneNumber
      );
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
          // Use shipping address phone only; admin must update address if missing
          phone: normalizePhonePL(address?.phoneNumber) ?? "",
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

        const dim1 = parseInt(process.env.APACZKA_DEFAULT_DIM1 || "30", 10);
        const dim2 = parseInt(process.env.APACZKA_DEFAULT_DIM2 || "25", 10);
        const dim3 = parseInt(process.env.APACZKA_DEFAULT_DIM3 || "15", 10);
        const weight = Number(process.env.APACZKA_DEFAULT_WEIGHT || "4");
        const apOrder: any = {
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
              dimension1: dim1,
              dimension2: dim2,
              dimension3: dim3,
              weight: weight,
              is_nstd: 0,
              shipment_type_code: "PACZKA",
            },
          ],
          comment: `Zamówienie [${order.id}]`,
          content: `Szkło! Proszę nie rzucać!`,
          is_zebra: 0,
        };

        if (order.apaczkaPointId && order.apaczkaPointSupplier) {
          // Send the map access point and attempt to resolve it to the
          // internal Apaczka point id for this account. If resolution
          // succeeds, use the internal id in foreign_address_id (required
          // by Apaczka for point deliveries).
          (apOrder.address.receiver as any).foreign_access_point_id = order.apaczkaPointId;
          (apOrder.address.receiver as any).supplier =
            ({ INPOST: "INPOST", DPD: "DPD", DHL: "DHL_PARCEL", DHL_PARCEL: "DHL_PARCEL" } as any)[
              order.apaczkaPointSupplier.toUpperCase()
            ] || order.apaczkaPointSupplier;
          try {
            const resolved = await Apaczka.resolvePoint(
              (apOrder.address.receiver as any).supplier,
              String(order.apaczkaPointId),
              apOrder.address.receiver.country_code || "PL"
            );
            if ((resolved as any).internalId) {
              (apOrder.address.receiver as any).foreign_address_id = (resolved as any).internalId;
              console.log("Resolved point for order", order.id, "->", (resolved as any).internalId);
            } else {
              // keep the original map code in foreign_address_id for logging;
              // Apaczka will likely reject; we'll let sendOrder handle it and
              // surface a clear error to admin.
              (apOrder.address.receiver as any).foreign_address_id = order.apaczkaPointId;
              console.log(
                "Could not resolve map point for order",
                order.id,
                "tried:",
                (resolved as any).tried
              );
            }
          } catch (e) {
            console.warn("resolvePoint failed for order", order.id, String(e));
            (apOrder.address.receiver as any).foreign_address_id = order.apaczkaPointId;
          }
          const supplier = order.apaczkaPointSupplier.toUpperCase();
          const supplierMap: Record<string, string> = {
            INPOST: "INPOST",
            DPD: "DPD",
            DHL: "DHL_PARCEL",
            DHL_PARCEL: "DHL_PARCEL",
          };
          (apOrder.address.receiver as any).supplier = supplierMap[supplier] || supplier;
          // Ensure service_id is door_to_point for supplier; correct using service_structure when needed
          try {
            const svc = await Apaczka.serviceStructure();
            const services = (svc as any).response?.services || [];
            const candidates = services.filter(
              (s: any) =>
                s.supplier?.toUpperCase() ===
                  (apOrder.address.receiver as any).supplier.toUpperCase() &&
                s.door_to_point === "1"
            );
            if (candidates.length) {
              let pick = candidates[0];
              const pid = String(order.apaczkaPointId);
              if (
                ((apOrder.address.receiver as any).supplier as string).toUpperCase() === "INPOST" &&
                candidates.length > 1
              ) {
                if (pid.startsWith("POP-")) {
                  pick = candidates.find((s: any) => /punkt/i.test(s.name)) || pick;
                } else {
                  pick =
                    candidates.find(
                      (s: any) => /paczkomat/i.test(s.name) || /paczkomaty/i.test(s.name)
                    ) || pick;
                }
              }
              if (String(pick.service_id) !== String(apOrder.service_id)) {
                console.log(
                  "Adjusting service_id for point delivery:",
                  apOrder.service_id,
                  "->",
                  pick.service_id,
                  "name=",
                  pick.name
                );
                apOrder.service_id = Number(pick.service_id);
              }
            }
          } catch (e) {
            console.warn("Could not adjust service_id via service_structure (bulk)", e);
          }
          // After service adjustment, ensure pickup type matches service requirements
          try {
            const svcAll = await Apaczka.serviceStructure();
            const svcEntry = (svcAll as any).response?.services?.find(
              (s: any) => String(s.service_id) === String(apOrder.service_id)
            );
            const pickupCourier = svcEntry?.pickup_courier;
            if (pickupCourier === "1" || pickupCourier === "2") {
              apOrder.pickup = {
                type: "COURIER",
                date: new Date().toISOString().slice(0, 10),
                hours_from: "09:00",
                hours_to: "17:00",
              };
            } else {
              // keep existing SELF or remove if not appropriate
              delete apOrder.pickup;
            }
          } catch (e) {
            // ignore pickup adjustment failures
          }
        }

        // If point delivery selected, ensure receiver phone is present
        if (
          order.apaczkaPointId &&
          !(
            (apOrder.address.receiver as any).phone &&
            String((apOrder.address.receiver as any).phone).trim()
          )
        ) {
          throw new ApiError(`Order ${order.id} missing recipient phone for point delivery.`, 400);
        }

        try {
          console.log("Apaczka payload for order", order.id, JSON.stringify(apOrder));
        } catch {}

        let res;
        try {
          res = await Apaczka.sendOrder(apOrder);
        } catch (e: any) {
          (e as any).payload = apOrder;
          console.error(
            "Apaczka sendOrder failed for order",
            order.id,
            e?.message,
            "payload:",
            apOrder
          );
          throw e;
        }
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
        // Try to notify customer by email about shipment
        try {
          if (order.user?.email) {
            const html = `<p>Dzień dobry ${order.user.firstName ?? ""},</p>
              <p>Twoje zamówienie <strong>${order.id}</strong> zostało wysłane. Numer przesyłki: <strong>${ap.waybill_number}</strong>.</p>
              <p>Śledź przesyłkę: <a href="${ap.tracking_url}">${ap.tracking_url}</a></p>
              <p>Pozdrawiamy,<br/>Zespół</p>`;
            await mailer.sendMail({
              to: order.user.email,
              subject: `Twoje zamówienie ${order.id} zostało wysłane`,
              html,
            });
          }
        } catch (e) {
          console.error("Failed to send shipment email for order", order.id, e);
        }
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
