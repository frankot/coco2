import { createRouteHandler, ApiError } from "@/lib/api";
import Apaczka, { buildApaczkaShipments, type PackItem } from "@/lib/apaczka";
import prisma from "@/db";
import { z } from "zod";
import { apaczkaLimiter, getClientIp } from "@/lib/rate-limit";

const valuationSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1),
    })
  ),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  serviceId: z.string().optional(),
});

function getSenderAddress() {
  return {
    country_code: process.env.SENDER_COUNTRY_CODE || "PL",
    name: process.env.SENDER_NAME || "",
    line1: process.env.SENDER_LINE1 || "",
    line2: process.env.SENDER_LINE2 || "",
    postal_code: process.env.SENDER_POSTAL_CODE || "",
    state_code: process.env.SENDER_STATE_CODE || "",
    city: process.env.SENDER_CITY || "",
    is_residential: 0,
    contact_person: process.env.SENDER_CONTACT_PERSON || "",
    email: process.env.SENDER_EMAIL || "",
    phone: process.env.SENDER_PHONE || "",
  };
}

export const POST = createRouteHandler(async ({ req }) => {
  const ip = getClientIp(req);
  const check = await apaczkaLimiter.limit(ip);
  if (!check.success) throw new ApiError("Za dużo prób, spróbuj później", 429);

  const body = await req.json();
  const data = valuationSchema.parse(body);

  const productIds = data.cartItems.map((item) => item.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true },
    select: {
      id: true,
      weightKg: true,
      lengthCm: true,
      widthCm: true,
      heightCm: true,
      priceInCents: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Multipack: max 4 units per pack, 2x2 layer
  let shipmentValueInCents = 0;
  const packItems: PackItem[] = [];

  for (const item of data.cartItems) {
    const product = productMap.get(item.id);
    if (!product) {
      throw new ApiError(`Produkt ${item.id} nie znaleziony`, 400);
    }
    shipmentValueInCents += product.priceInCents * item.quantity;
    packItems.push({
      lengthCm: product.lengthCm,
      widthCm: product.widthCm,
      heightCm: product.heightCm,
      weightKg: product.weightKg,
      quantity: item.quantity,
    });
  }

  const order: Record<string, any> = {
    service_id: data.serviceId ? Number(data.serviceId) : 0,
    address: {
      sender: getSenderAddress(),
      receiver: {
        country_code: "PL",
        name: "",
        line1: "",
        line2: "",
        postal_code: data.postalCode,
        state_code: "",
        city: data.city,
        is_residential: 1,
        contact_person: "",
        email: "",
        phone: "",
      },
    },
    shipment: buildApaczkaShipments(packItems),
    shipment_value: shipmentValueInCents,
    shipment_currency: "PLN",
    pickup: {
      type: "SELF",
    },
  };

  const result = await Apaczka.orderValuation(order);
  return result;
});
