import prisma from "@/db";
import Apaczka from "@/lib/apaczka";
import { getOrigin } from "@/lib/get-origin";
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

/**
 * Confirms an order in the Apaczka shipping API, updates DB with tracking info,
 * and sends shipment notification email. Throws on failure.
 */
export async function confirmOrderInApaczka(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      shippingAddress: true,
      orderItems: { include: { product: { select: { weightKg: true, lengthCm: true, widthCm: true, heightCm: true } } } },
    },
  });

  if (!order) throw new Error("Order not found");
  if (!order.shippingServiceId) throw new Error("Order has no shipping service selected");
  if (order.apaczkaOrderId) return { alreadyConfirmed: true, orderId: order.apaczkaOrderId };

  const address = order.shippingAddress;
  const receiver = {
    country_code: "PL",
    name: `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() || order.user.email,
    line1: address?.street ?? "",
    line2: "",
    postal_code: address?.postalCode ?? "",
    state_code: "",
    city: address?.city ?? "",
    is_residential: order.apaczkaPointId ? 0 : 1,
    contact_person:
      `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() || order.user.email,
    email: order.user.email,
    phone: normalizePhonePL(address?.phoneNumber) ?? "",
    foreign_address_id: "",
  };

  // Validate sender env vars
  const requiredSenderEnv = {
    SENDER_NAME: process.env.SENDER_NAME,
    SENDER_CONTACT_PERSON: process.env.SENDER_CONTACT_PERSON,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    SENDER_PHONE: process.env.SENDER_PHONE,
    SENDER_LINE1: process.env.SENDER_LINE1,
    SENDER_CITY: process.env.SENDER_CITY,
    SENDER_POSTAL_CODE: process.env.SENDER_POSTAL_CODE,
  } as const;
  const missing = Object.entries(requiredSenderEnv)
    .filter(([, v]) => !v || String(v).trim() === "")
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(
      `Konfiguracja nadawcy niekompletna. Uzupełnij zmienne środowiskowe: ${missing.join(", ")}`
    );
  }

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

  // Aggregate per-product dimensions
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;
  for (const item of order.orderItems) {
    totalWeight += item.product.weightKg * item.quantity;
    maxLength = Math.max(maxLength, item.product.lengthCm);
    maxWidth = Math.max(maxWidth, item.product.widthCm);
    totalHeight += item.product.heightCm * item.quantity;
  }
  totalHeight = Math.min(totalHeight, 100);

  const shipment = [
    {
      dimension1: Math.max(maxLength, 1),
      dimension2: Math.max(maxWidth, 1),
      dimension3: Math.max(totalHeight, 1),
      weight: Math.max(Math.round(totalWeight * 10) / 10, 0.1),
      is_nstd: 0,
      shipment_type_code: "PACZKA",
    },
  ];

  const getPickupDate = () => {
    const now = new Date();
    const hour = now.getHours();
    let pickup = new Date(now);
    if (hour >= 14) pickup.setDate(pickup.getDate() + 1);
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
      hours_from: process.env.APACZKA_PICKUP_FROM || "09:00",
      hours_to: process.env.APACZKA_PICKUP_TO || "17:00",
    },
    shipment,
    comment: `Zamówienie [${order.id}]`,
    content: `Szkło! Proszę nie rzucać!`,
    is_zebra: 0,
  };

  if (order.paymentMethod === "COD" && order.pricePaidInCents && order.pricePaidInCents > 0) {
    apOrder.cod = {
      amount: order.pricePaidInCents,
      currency: process.env.APACZKA_CURRENCY || "PLN",
      bankaccount: process.env.APACZKA_COD_BANK_ACCOUNT || "",
      country: process.env.APACZKA_COD_COUNTRY || "PL",
    };
  }

  if (typeof order.pricePaidInCents === "number" && order.pricePaidInCents > 0) {
    apOrder.shipment_value = order.pricePaidInCents;
    apOrder.shipment_currency = (process.env.APACZKA_CURRENCY || "PLN").toUpperCase();
  }

  // D2P (door-to-point) service resolution
  if (order.apaczkaPointId && order.apaczkaPointSupplier) {
    const supplier = order.apaczkaPointSupplier.toUpperCase();
    const supplierMap: Record<string, string> = {
      INPOST: "INPOST",
      DPD: "DPD",
      DHL: "DHL_PARCEL",
      DHL_PARCEL: "DHL_PARCEL",
    };
    const mappedSupplier = supplierMap[supplier] || supplier;

    try {
      const svc = await Apaczka.serviceStructure();
      const services = svc.response?.services || [];
      const candidates = services.filter(
        (s: any) =>
          s.supplier?.toUpperCase() === mappedSupplier &&
          s.door_to_point === "1" &&
          s.domestic === "1"
      );

      if (candidates.length > 0) {
        let pick = candidates[0];
        const pid = String(order.apaczkaPointId).toUpperCase();

        if (mappedSupplier === "INPOST") {
          if (pid.startsWith("POP-")) {
            pick = candidates.find((s: any) => /punkt/i.test(s.name)) || pick;
          } else {
            pick = candidates.find((s: any) => /paczkomat/i.test(s.name)) || pick;
          }
        } else if (mappedSupplier === "DPD") {
          pick = candidates.find((s: any) => /pickup/i.test(s.name)) || candidates[0];
        }

        apOrder.service_id = Number(pick.service_id);
      }
    } catch (e) {
      console.warn("Could not query service_structure for D2P service_id:", e);
    }

    apOrder.address.receiver.foreign_address_id = order.apaczkaPointId;
  }

  if (
    order.apaczkaPointId &&
    !(apOrder.address.receiver.phone && String(apOrder.address.receiver.phone).trim())
  ) {
    throw new Error(
      "Brak numeru telefonu odbiorcy. Uzupełnij numer telefonu w adresie dostawy przed potwierdzeniem do Apaczka."
    );
  }

  console.log("[APACZKA] Sending order:", JSON.stringify(apOrder));

  const sent = await Apaczka.sendOrder(apOrder);
  const ap = sent.response.order;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      apaczkaOrderId: String(ap.id),
      apaczkaWaybillNumber: ap.waybill_number,
      apaczkaTrackingUrl: ap.tracking_url,
      apaczkaStatus: ap.status,
      shippingServiceName: ap.service_name,
      apaczkaConfirmedAt: new Date(),
    },
  });

  // Send shipment notification email
  try {
    if (order.user?.email) {
      const siteUrl = getOrigin();
      const html = `
        <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
          <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border-radius:8px;">
            <div style="text-align:center;margin-bottom:18px;">
              <img src="${siteUrl}/logo.png" alt="Logo" style="height:56px;object-fit:contain;" onerror="this.style.display='none'" />
            </div>
            <h1 style="font-size:20px;margin:0 0 8px;color:#0f172a;text-align:center;">Twoja przesyłka jest w drodze!</h1>
            <p style="margin:0 0 18px;text-align:center;color:#6b7280;">Twoje zamówienie <strong style="font-family:monospace">${order.id}</strong> zostało nadane i jest w drodze do Ciebie.</p>

            <div style="background:#f8fafc;padding:12px;border-radius:6px;margin-bottom:18px;">
              <strong>Informacje o przesyłce</strong>
              <div style="margin-top:8px;font-size:14px;color:#374151;">
                <div>Numer przesyłki: <strong style="font-family:monospace">${ap.waybill_number}</strong></div>
                <div style="margin-top:4px;">Przewoźnik: <strong>${ap.service_name || "Apaczka"}</strong></div>
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
      await mailer.sendMail({
        to: order.user.email,
        subject: `Przesyłka nadana - Zamówienie ${order.id}`,
        html,
      });
    }
  } catch (e) {
    console.error("Failed to send shipment email for order", order.id, e);
  }

  return { success: true, apaczka: ap };
}
