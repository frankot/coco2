import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import prisma from "@/db";
import Apaczka from "@/lib/apaczka";

type Body = { orderId: string };

export const POST = createRouteHandler(
  async ({ req }) => {
    const { orderId } = await readJson<Body>(req);
    if (!orderId) throw new ApiError("Missing orderId", 400);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, shippingAddress: true },
    });
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
      phone: address?.phoneNumber ?? "",
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

    // Shipment: naive package, 1 box, approximate weight; you may refine per order items later
    const shipment = [
      {
        dimension1: 30,
        dimension2: 20,
        dimension3: 10,
        weight: 2,
        is_nstd: 0,
        shipment_type_code: "PACZKA",
      },
    ];

    const apOrder = {
      service_id: Number(order.shippingServiceId),
      address: { sender: SENDER, receiver },
      shipment_value: order.subtotalInCents, // grosze
      pickup: {
        type: "SELF",
        date: new Date().toISOString().slice(0, 10),
        hours_from: "09:00",
        hours_to: "17:00",
      },
      shipment,
      comment: `Zamówienie [${order.id}]`,
      content: `Szkło! Proszę nie rzucać!`,
      is_zebra: 0,
    };

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
        status: "PROCESSING",
      },
    });

    return { success: true, apaczka: ap };
  },
  { auth: "admin" }
);
