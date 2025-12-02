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

        const dim1 = parseInt(process.env.APACZKA_DEFAULT_DIM1 || "30", 10);
        const dim2 = parseInt(process.env.APACZKA_DEFAULT_DIM2 || "25", 10);
        const dim3 = parseInt(process.env.APACZKA_DEFAULT_DIM3 || "15", 10);
        const weight = Number(process.env.APACZKA_DEFAULT_WEIGHT || "4");

        // Calculate pickup date: next business day (Mon-Fri) if after 14:00, otherwise today if business day
        const getPickupDate = () => {
          const now = new Date();
          const hour = now.getHours();
          let pickup = new Date(now);

          // If after 14:00, schedule for next day
          if (hour >= 14) {
            pickup.setDate(pickup.getDate() + 1);
          }

          // Skip weekends: if Saturday (6), move to Monday; if Sunday (0), move to Monday
          while (pickup.getDay() === 0 || pickup.getDay() === 6) {
            pickup.setDate(pickup.getDate() + 1);
          }

          return pickup.toISOString().slice(0, 10);
        };

        const apOrder: any = {
          service_id: Number(order.shippingServiceId),
          address: { sender: SENDER, receiver },
          pickup: {
            type: "COURIER",
            date: getPickupDate(),
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

        // Include declared value (insurance) only when explicitly enabled.
        const declare = String(process.env.APACZKA_DECLARE_VALUE || "").toLowerCase();
        const declareOn = declare === "1" || declare === "true" || declare === "yes";
        if (declareOn && typeof order.subtotalInCents === "number" && order.subtotalInCents > 0) {
          apOrder.shipment_value = order.subtotalInCents; // grosze
          apOrder.shipment_currency = (process.env.APACZKA_CURRENCY || "PLN").toUpperCase();
        } else {
          // Remove shipment_value if insurance is disabled
          delete apOrder.shipment_value;
        }

        if (order.apaczkaPointId && order.apaczkaPointSupplier) {
          console.log(
            `[Bulk] D2P delivery: supplier=${order.apaczkaPointSupplier}, point=${order.apaczkaPointId}, forcing service_id=41`
          );

          // Force service_id to 41 for ALL door-to-point deliveries (InPost, DPD, DHL)
          apOrder.service_id = 41;

          // Set point code in foreign_address_id (NOT foreign_access_point_id)
          (apOrder.address.receiver as any).foreign_address_id = order.apaczkaPointId;

          // Ensure COURIER pickup for D2P
          apOrder.pickup = {
            type: "COURIER",
            date: getPickupDate(),
            hours_from: "09:00",
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
            const html = `
              <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
                <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border-radius:8px;">
                  <div style="text-align:center;margin-bottom:18px;">
                    <img src="cid:logo.png" alt="Logo" style="height:56px;object-fit:contain;" onerror="this.style.display='none'" />
                  </div>
                  <h1 style="font-size:20px;margin:0 0 8px;color:#0f172a;text-align:center;">Twoja przesyłka jest w drodze!</h1>
                  <p style="margin:0 0 18px;text-align:center;color:#6b7280;">Twoje zamówienie <strong style="font-family:monospace">${order.id}</strong> zostało nadane i jest w drodze do Ciebie.</p>

                  <div style="background:#f8fafc;padding:12px;border-radius:6px;margin-bottom:18px;">
                    <strong>Informacje o przesyłce</strong>
                    <div style="margin-top:8px;font-size:14px;color:#374151;">
                      <div>Numer przesyłki: <strong style="font-family:monospace">${ap.waybill_number}</strong></div>
                      <div style="margin-top:4px;">Przewoźnik: <strong>${ap.service_name || 'Apaczka'}</strong></div>
                    </div>
                  </div>

                  <div style="text-align:center;margin-bottom:18px;">
                    <a href="${ap.tracking_url}" style="display:inline-block;background:#111827;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;">Śledź przesyłkę</a>
                  </div>

                  <p style="color:#6b7280;font-size:13px;margin:0;">Jeśli masz pytania, odpisz na tę wiadomość lub odwiedź naszą stronę.</p>

                  <div style="margin-top:18px;color:#9ca3af;font-size:12px;text-align:center;">Pozdrawiamy,<br/>Zespół</div>
                </div>
              </div>
            `;
            
            // Try to attach logo from public folder if present
            const attachments: any[] = [];
            try {
              const logoPath = process.cwd() + "/public/logo.png";
              // eslint-disable-next-line no-eval
              const fs: any = eval("require")("fs");
              if (fs.existsSync(logoPath)) {
                attachments.push({ filename: "logo.png", path: logoPath, cid: "logo.png" });
              }
            } catch (e) {
              // ignore attachment failures
            }
            
            await mailer.sendMail({
              to: order.user.email,
              subject: `Przesyłka nadana - Zamówienie ${order.id}`,
              html,
              attachments: attachments.length ? attachments : undefined,
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
