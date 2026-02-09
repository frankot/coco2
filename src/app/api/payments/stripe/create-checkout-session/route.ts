import { stripe } from "@/lib/stripe";
import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import prisma from "@/db";

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { orderId, items } = body;
  const customerEmail = body.email as string | undefined;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = process.env.NEXT_PUBLIC_URL || `${protocol}://localhost:3000`;
  if (!origin) throw new ApiError("No origin header or NEXT_PUBLIC_URL found", 500);

  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError("Items array is required and must not be empty", 400);
  }

  // Look up all product prices from the database — never trust client prices
  const productIds = items.map((item: any) => item.productId).filter(Boolean);
  if (productIds.length !== items.length) {
    throw new ApiError("Each item must include a valid productId", 400);
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true },
    select: { id: true, name: true, priceInCents: true, imagePaths: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Verify all products exist and are available
  const lineItems = items.map((item: any) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new ApiError(`Product not found or unavailable: ${item.productId}`, 400);
    }
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    return {
      price_data: {
        currency: "pln",
        product_data: {
          name: product.name,
          images: product.imagePaths.length > 0 ? [product.imagePaths[0]] : [],
        },
        unit_amount: product.priceInCents, // DB price, not client price
      },
      quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "blik", "p24"],
    mode: "payment",
    locale: "pl",
    line_items: lineItems,
    // include customer email so Stripe can send a receipt to the customer in test mode
    ...(customerEmail
      ? { customer_email: customerEmail, payment_intent_data: { receipt_email: customerEmail } }
      : {}),
    success_url: `${origin}/kasa/zlozone-zamowienie/${orderId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/kasa?canceled=true`,
    metadata: { orderId },
  });
  return { sessionId: session.id, url: session.url };
});
