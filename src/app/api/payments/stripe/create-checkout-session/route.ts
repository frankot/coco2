import { stripe } from "@/lib/stripe";
import { createRouteHandler, ApiError, readJson } from "@/lib/api";

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { orderId, items } = body;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = process.env.NEXT_PUBLIC_URL || `${protocol}://localhost:3000`;
  if (!origin) throw new ApiError("No origin header or NEXT_PUBLIC_URL found", 500);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "blik", "p24"],
    mode: "payment",
    locale: "pl",
    line_items: items.map((item: any) => ({
      price_data: {
        currency: "pln",
        product_data: { name: item.name, images: [item.imagePath] },
        unit_amount: item.priceInCents,
      },
      quantity: item.quantity,
    })),
    success_url: `${origin}/kasa/zlozone-zamowienie/${orderId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/kasa?canceled=true`,
    metadata: { orderId },
  });
  return { sessionId: session.id, url: session.url };
});
