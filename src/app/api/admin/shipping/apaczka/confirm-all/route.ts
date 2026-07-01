import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import prisma from "@/db";
import Apaczka, { buildApaczkaShipments } from "@/lib/apaczka";
import mailer from "@/lib/mailer";
import { renderEmailLayout } from "@/lib/email-layout";
function normalizePhonePL(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  const digits = input.replace(/\D+/g, "");
  if (digits.length === 9) return "+48" + digits;
  if (digits.length === 11 && digits.startsWith("48")) return "+" + digits;
  if (digits.length === 12 && digits.startsWith("0048")) return "+" + digits.slice(2);
  if (input.startsWith("+48") && digits.length === 11) return input;
  return input;
}

type Body = { orderIds?: string[]; limit?: number };

export const POST = createRouteHandler(
  async ({ req }) => {
    const { orderIds, limit = 100 } = await readJson<Body>(req);

    const where = {
      id: orderIds && orderIds.length ? { in: orderIds } : undefined,
      apaczkaOrderId: null as any,
      status: { in: ["PAID"] } as any,
      shippingServiceId: { not: null } as any,
      isB2BManual: false,
    };

    const orders = await prisma.order.findMany({
      where: where as any,
      include: {
        user: true,
        shippingAddress: true,
        orderItems: { include: { product: { select: { name: true, weightKg: true, lengthCm: true, widthCm: true, heightCm: true } } } },
      },
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
        order.shippingAddress?.phoneNumber,
        "paymentMethod=",
        order.paymentMethod
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
          // For D2P deliveries, is_residential should be 0 (point), for D2D it should be 1 (home)
          is_residential: order.apaczkaPointId ? 0 : 1,
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

        // Multipack: max 4 units per pack, 2x2 layer
        const shipment = buildApaczkaShipments(
          order.orderItems.map((item) => ({
            lengthCm: item.product.lengthCm,
            widthCm: item.product.widthCm,
            heightCm: item.product.heightCm,
            weightKg: item.product.weightKg,
            quantity: item.quantity,
          }))
        );

        // Supplier-specific pickup configuration
        let supplier = (order.apaczkaPointSupplier || "").toUpperCase();
        // For D2D orders without apaczkaPointSupplier, resolve supplier from service_id
        if (!supplier && order.shippingServiceId) {
          try {
            const svc = await Apaczka.serviceStructure();
            const services = (svc as any).response?.services || [];
            const svcMatch = services.find(
              (s: any) => String(s.service_id) === String(order.shippingServiceId)
            );
            if (svcMatch) supplier = (svcMatch.supplier || "").toUpperCase();
          } catch (e) {
            // fall through — will default to COURIER
          }
        }
        const isSelfPickup = supplier === "DPD";

        // Calculate pickup date: same-day if before 14:00, otherwise next business day
        const getPickupDate = () => {
          const now = new Date();
          let pickup = new Date(now);
          if (now.getHours() >= 14) pickup.setDate(pickup.getDate() + 1);
          // Skip weekends
          while (pickup.getDay() === 0 || pickup.getDay() === 6) {
            pickup.setDate(pickup.getDate() + 1);
          }
          return pickup.toISOString().slice(0, 10);
        };

        const apOrder: any = {
          service_id: Number(order.shippingServiceId),
          address: { sender: SENDER, receiver },
          pickup: {
            type: isSelfPickup ? ("SELF" as const) : ("COURIER" as const),
            date: getPickupDate(),
            hours_from: "14:00",
            hours_to: "17:00",
          },
          shipment,
          comment: order.orderItems.map((oi) => `${oi.quantity}x ${oi.product.name}`).join(", "),
          content: order.orderItems.map((oi) => `${oi.quantity}x ${oi.product.name}`).join(", "),
          is_zebra: 0,
        };

        // Always declare shipment value for all orders (required for COD, recommended for others)
        // Use total price paid (including shipping) as the declared value
        if (typeof order.pricePaidInCents === "number" && order.pricePaidInCents > 0) {
          apOrder.shipment_value = order.pricePaidInCents; // grosze - total order value
          apOrder.shipment_currency = (process.env.APACZKA_CURRENCY || "PLN").toUpperCase();
          console.log(
            `[Bulk] Declared shipment value: ${order.pricePaidInCents} groszy (${apOrder.shipment_currency})`
          );
        } else {
          // Remove shipment_value if order has no price
          delete apOrder.shipment_value;
        }

        // Add COD (Cash on Delivery) if payment method is COD
        // Note: shipment_value is also required at order level (see above)
        if (order.paymentMethod === "COD" && order.pricePaidInCents && order.pricePaidInCents > 0) {
          apOrder.cod = {
            amount: order.pricePaidInCents, // value in groszy - must equal or be close to shipment_value
            currency: process.env.APACZKA_CURRENCY || "PLN",
            bankaccount: process.env.APACZKA_COD_BANK_ACCOUNT || "", // only digits
            country: process.env.APACZKA_COD_COUNTRY || "PL",
          };
          console.log(
            `[Bulk] COD delivery detected for order ${order.id}, amount: ${order.pricePaidInCents} groszy`
          );
        }

        if (order.apaczkaPointId && order.apaczkaPointSupplier) {
          const supplier = order.apaczkaPointSupplier.toUpperCase();
          const supplierMap: Record<string, string> = {
            INPOST: "INPOST",
            DPD: "DPD",
            DHL: "DHL_PARCEL",
            DHL_PARCEL: "DHL_PARCEL",
          };
          const mappedSupplier = supplierMap[supplier] || supplier;

          console.log(
            `[Bulk] D2P delivery: supplier=${mappedSupplier}, point=${order.apaczkaPointId}, finding correct service_id`
          );

          // Query service_structure to find the correct D2P service for this supplier
          try {
            const svc = await Apaczka.serviceStructure();
            const services = (svc as any).response?.services || [];

            // Filter for door_to_point services matching supplier
            const candidates = services.filter(
              (s: any) =>
                s.supplier?.toUpperCase() === mappedSupplier &&
                s.door_to_point === "1" &&
                s.domestic === "1"
            );

            if (candidates.length > 0) {
              // For INPOST: prefer Paczkomat (typically service_id 41)
              let pick = candidates[0];
              const pid = String(order.apaczkaPointId).toUpperCase();

              if (mappedSupplier === "INPOST") {
                if (pid.startsWith("POP-")) {
                  // POP- prefix = Punkt (INPOST Punkt)
                  pick = candidates.find((s: any) => /punkt/i.test(s.name)) || pick;
                } else {
                  // Regular locker code = Paczkomat
                  pick = candidates.find((s: any) => /paczkomat/i.test(s.name)) || pick;
                }
              } else if (mappedSupplier === "DPD") {
                // For DPD: prefer "Pickup" service
                pick = candidates.find((s: any) => /pickup/i.test(s.name)) || candidates[0];
              }

              apOrder.service_id = Number(pick.service_id);
              console.log(
                `[Bulk] Found D2P service for ${mappedSupplier}: service_id=${pick.service_id} (${pick.name})`
              );
            } else {
              console.warn(
                `[Bulk] No D2P service found for ${mappedSupplier}, keeping service_id=${apOrder.service_id}`
              );
            }
          } catch (e) {
            console.warn("[Bulk] Could not query service_structure for D2P service_id:", e);
          }

          // Set point code in foreign_address_id (NOT foreign_access_point_id)
          (apOrder.address.receiver as any).foreign_address_id = order.apaczkaPointId;

          // Set pickup for D2P (SELF for DPD, COURIER 14-17 for others)
          apOrder.pickup = {
            type: isSelfPickup ? ("SELF" as const) : ("COURIER" as const),
            date: getPickupDate(),
            hours_from: "14:00",
            hours_to: "17:00",
          };
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
            const emailBody = `
              <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Twoje zamówienie <strong style="font-family:ui-monospace,Menlo,Monaco,monospace;">${order.id}</strong> zostało nadane i jest w drodze do Ciebie.</p>
              <div style="background:#eef9f9;border:1px solid #76c3c5;border-radius:10px;padding:14px;margin:0 0 14px;">
                <div style="font-size:14px;color:#0d160f;margin-bottom:6px;">Numer przesyłki: <strong>${ap.waybill_number}</strong></div>
                <div style="font-size:14px;color:#0d160f;">Przewoźnik: <strong>${ap.service_name || "Apaczka"}</strong></div>
              </div>
              <p style="margin:0;font-size:14px;color:#2b6a4b;">Kliknij poniżej, aby sprawdzić gdzie jest Twoja paczka.</p>
            `;
            const html = renderEmailLayout({
              title: "Twoja przesyłka jest w drodze!",
              intro: "Przekazaliśmy przesyłkę kurierowi.",
              body: emailBody,
              ctaLabel: "Śledź przesyłkę",
              ctaHref: ap.tracking_url,
            });
            await mailer.sendMail({
              to: order.user.email,
              subject: `Przesyłka nadana - Zamówienie ${order.id}`,
              html,
            });
          }
        } catch (e) {
          console.error("Failed to send shipment email for order", order.id, e);
        }
        created.push({ id: order.id, apaczkaOrderId: String(ap.id) });
      } catch (e: any) {
        // Extract detailed error info
        const errorDetails = e?.details || {};
        const errorMessage = e?.message || String(e);
        const validationErrors = errorDetails?.response?.errors || [];

        // Build detailed error message
        let detailedMsg = errorMessage;
        if (validationErrors.length > 0) {
          detailedMsg += ": " + validationErrors.join(", ");
        }

        failed.push({ id: order.id, error: detailedMsg });
      }
    }

    return { success: true, created, failed };
  },
  { auth: "admin" }
);
