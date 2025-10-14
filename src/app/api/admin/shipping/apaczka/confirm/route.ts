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
  return input; // Leave as-is; Apaczka may still accept
}

type Body = { orderId: string };

export const POST = createRouteHandler(
  async ({ req }) => {
    const { orderId } = await readJson<Body>(req);
    if (!orderId) throw new ApiError("Missing orderId", 400);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, shippingAddress: true },
    });
    console.log(
      "Confirm single: stored apaczkaPointId=",
      order?.apaczkaPointId,
      "supplier=",
      order?.apaczkaPointSupplier,
      "serviceId=",
      order?.shippingServiceId,
      "phone=",
      order?.shippingAddress?.phoneNumber
    );
    if (!order) throw new ApiError("Order not found", 404);
    if (!order.shippingServiceId) throw new ApiError("Order has no shipping service selected", 400);
    if (order.apaczkaOrderId) {
      return { success: true, message: "Order already confirmed", orderId: order.apaczkaOrderId };
    }

    // Build Apaczka order payload from our order
    const address = order.shippingAddress;
    const receiver = {
      country_code: "PL",
      name: `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() || order.user.email,
      line1: address?.street ?? "",
      line2: "",
      postal_code: address?.postalCode ?? "",
      state_code: "",
      city: address?.city ?? "",
      is_residential: 1,
      contact_person:
        `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() || order.user.email,
      email: order.user.email,
      // Apaczka requires phone for point pickup — use shipping address phone only
      phone: normalizePhonePL(address?.phoneNumber) ?? "",
      foreign_address_id: "",
    };

    // Sender: use env config and validate required fields to avoid Apaczka 400
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
      throw new ApiError(
        `Konfiguracja nadawcy niekompletna. Uzupełnij zmienne środowiskowe: ${missing.join(", ")}`,
        400
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

    // Shipment: use defaults from env when available. Values are in cm and kg and
    // Apaczka expects weight in kg and dimensions in cm. We store shipment_value
    // in grosze (cents). Adjust per-order extraction later.
    const dim1 = parseInt(process.env.APACZKA_DEFAULT_DIM1 || "30", 10);
    const dim2 = parseInt(process.env.APACZKA_DEFAULT_DIM2 || "25", 10);
    const dim3 = parseInt(process.env.APACZKA_DEFAULT_DIM3 || "15", 10);
    const weight = Number(process.env.APACZKA_DEFAULT_WEIGHT || "4");
    const shipment = [
      {
        dimension1: dim1,
        dimension2: dim2,
        dimension3: dim3,
        weight: weight,
        is_nstd: 0,
        shipment_type_code: "PACZKA",
      },
    ];

    const apOrder: any = {
      service_id: Number(order.shippingServiceId),
      address: { sender: SENDER, receiver },
      shipment_value: order.subtotalInCents, // grosze
      // pickup: added below conditionally after checking service_structure
      shipment,
      comment: `Zamówienie [${order.id}]`,
      content: `Szkło! Proszę nie rzucać!`,
      is_zebra: 0,
    };

    // If this is a door-to-point delivery, include point info according to Apaczka schema
    if (order.apaczkaPointId && order.apaczkaPointSupplier) {
      const supplier = order.apaczkaPointSupplier.toUpperCase();
      // Attach both fields: some parts of Apaczka expect 'foreign_access_point_id'
      // (map widget) while the order structure/docs reference 'foreign_address_id'
      // (points endpoint). Send both to maximize compatibility.
      apOrder.address.receiver.foreign_access_point_id = order.apaczkaPointId;
      apOrder.address.receiver.foreign_address_id = order.apaczkaPointId;
      // Map supplier to Apaczka expected codes when needed
      const supplierMap: Record<string, string> = {
        INPOST: "INPOST",
        DPD: "DPD",
        DHL: "DHL_PARCEL",
        DHL_PARCEL: "DHL_PARCEL",
      };
      apOrder.address.receiver.supplier = supplierMap[supplier] || supplier;
      // Apaczka may also require address.line1/line2 to reflect point name for some carriers; keep street as provided.
      // Ensure service_id is a door_to_point service for the supplier. If not, correct it using service_structure.
      try {
        const svc = await Apaczka.serviceStructure();
        const services = svc.response?.services || [];
        const candidates = services.filter(
          (s: any) =>
            s.supplier?.toUpperCase() ===
              (apOrder.address.receiver.supplier as string).toUpperCase() && s.door_to_point === "1"
        );
        if (candidates.length) {
          let pick = candidates[0];
          const pid = String(order.apaczkaPointId);
          // INPOST heuristic: POP- means Punkt; otherwise Paczkomat
          if (
            (apOrder.address.receiver.supplier as string).toUpperCase() === "INPOST" &&
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
          // Decide whether pickup should be included. If the service requires
          // courier pickup (pickup_courier === '2') or allows it ('1'), include
          // the pickup object. If pickup_courier === '0' (not available) then
          // omit pickup for point-to-point consignments as some carriers treat
          // pickup + point together as an invalid method.
          const pickupCourier =
            pick.pickup_courier ??
            svc.response?.services?.find(
              (s: any) => String(s.service_id) === String(pick.service_id)
            )?.pickup_courier;
          if (pickupCourier === "2" || pickupCourier === "1") {
            apOrder.pickup = {
              type: "SELF",
              date: new Date().toISOString().slice(0, 10),
              hours_from: "09:00",
              hours_to: "17:00",
            };
          } else {
            // ensure no pickup present
            delete apOrder.pickup;
          }
          // If the service entry includes a points_type we can try to resolve the
          // map's foreign_access_point_id (e.g. "POP-WAW545") to the numeric
          // internal id used by points/:type responses. This often should be
          // provided in order.receiver.foreign_address_id.
          try {
            // Prefer explicit pick.points_type. If not present, try to find a
            // points_type in the global list that matches the supplier name.
            let pointsType = (pick.points_type as string) || undefined;
            if (!pointsType && Array.isArray(svc.response?.points_type)) {
              const pt = (svc.response.points_type as string[]).find(
                (p: string) =>
                  String(p).toUpperCase() ===
                  String(apOrder.address.receiver.supplier).toUpperCase()
              );
              if (pt) pointsType = pt;
            }
            // fallback: try supplier code itself
            if (!pointsType)
              pointsType = String(apOrder.address.receiver.supplier || "").toUpperCase();

            if (pointsType) {
              const ptsRes = await Apaczka.points(
                pointsType,
                apOrder.address.receiver.country_code || "PL"
              );
              const pts = ptsRes.response?.points || {};
              // Find a point where foreign_access_point_id matches our map id
              const mapPid = String(order.apaczkaPointId);
              for (const [key, val] of Object.entries(pts)) {
                const p: any = val as any;
                // Some points have foreign_access_point_id or a code in address
                const fav =
                  p.foreign_access_point_id ||
                  p.address?.foreign_access_point_id ||
                  p.code ||
                  p.external_id;
                if (fav && String(fav).toUpperCase() === mapPid.toUpperCase()) {
                  // key is usually the internal numeric id string
                  apOrder.address.receiver.foreign_address_id = key;
                  // keep foreign_access_point_id too for safety
                  apOrder.address.receiver.foreign_access_point_id = mapPid;
                  console.log(
                    "Resolved map foreign_access_point_id",
                    mapPid,
                    "to internal point id",
                    key,
                    "using points_type",
                    pointsType
                  );
                  break;
                }
              }
            }
          } catch (e) {
            console.warn("Could not resolve points for service to map foreign_access_point_id", e);
          }
        }
      } catch (e) {
        console.warn("Could not adjust service_id via service_structure", e);
      }
      // Ensure pickup type correctness: if the chosen service supports/needs
      // courier pickup (pickup_courier !== '0') then use COURIER. Otherwise
      // omit pickup for point deliveries.
      try {
        const svcAll = await Apaczka.serviceStructure();
        const svcEntry = (svcAll.response?.services || []).find(
          (s: any) => String(s.service_id) === String(apOrder.service_id)
        );
        const pickupCourier = svcEntry?.pickup_courier;
        if (pickupCourier === "1" || pickupCourier === "2") {
          // Use COURIER when pickup is available or required — SELF caused errors for this service
          apOrder.pickup = {
            type: "COURIER",
            date: new Date().toISOString().slice(0, 10),
            hours_from: "09:00",
            hours_to: "17:00",
          };
        } else {
          delete apOrder.pickup;
        }
      } catch (e) {
        // ignore pickup adjustment failures
      }
    }

    // If point delivery selected, ensure receiver phone is present
    if (
      order.apaczkaPointId &&
      !(apOrder.address.receiver.phone && String(apOrder.address.receiver.phone).trim())
    ) {
      throw new ApiError(
        "Brak numeru telefonu odbiorcy. Uzupełnij numer telefonu w adresie dostawy przed potwierdzeniem do Apaczka.",
        400
      );
    }

    // Debug: log payload sent to Apaczka for easier diagnosis
    try {
      console.log("Apaczka payload:", JSON.stringify(apOrder));
    } catch {}

    let sent;
    try {
      sent = await Apaczka.sendOrder(apOrder);
    } catch (e: any) {
      // Attach payload to error for easier debugging in logs
      (e as any).payload = apOrder;
      console.error("Apaczka sendOrder failed:", e?.message, "payload:", apOrder);
      throw e;
    }

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
        status: "PROCESSING",
      },
    });

    // Send shipment notification email to customer
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

    return { success: true, apaczka: ap };
  },
  { auth: "admin" }
);
