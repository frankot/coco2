import { stripe } from "@/lib/stripe";
import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import prisma from "@/db";
import { getOrigin } from "@/lib/get-origin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCustomPriceMap } from "@/lib/resolve-prices";

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { orderId, items, token } = body;
  const customerEmail = body.email as string | undefined;
  const origin = getOrigin();
  if (!origin) throw new ApiError("No origin found", 500);

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

  // Resolve custom prices for authenticated user
  const authSession = await getServerSession(authOptions);
  if (authSession?.user?.id) {
    const customPrices = await getCustomPriceMap(authSession.user.id);
    for (const product of products) {
      const customPrice = customPrices.get(product.id);
      if (customPrice !== undefined) {
        product.priceInCents = customPrice;
      }
    }
  }

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

  // Apply discount as Stripe coupon if order has one
  let discounts: { coupon: string }[] = [];
  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { discountAmountInCents: true, discountCodeValue: true },
    });
    if (order?.discountAmountInCents && order.discountAmountInCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: order.discountAmountInCents,
        currency: "pln",
        duration: "once",
        name: `Rabat: ${order.discountCodeValue || "kod"}`,
      });
      discounts = [{ coupon: coupon.id }];
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "blik"],
    mode: "payment",
    locale: "pl",
    line_items: lineItems,
    ...(discounts.length > 0 ? { discounts } : {}),
    // include customer email so Stripe can send a receipt to the customer in test mode
    ...(customerEmail
      ? { customer_email: customerEmail, payment_intent_data: { receipt_email: customerEmail } }
      : {}),
    success_url: `${origin}/kasa/zlozone-zamowienie/${orderId}?success=true&session_id={CHECKOUT_SESSION_ID}${token ? `&token=${encodeURIComponent(token)}` : ""}`,
    cancel_url: `${origin}/kasa?canceled=true`,
    metadata: { orderId },
  });
  return { sessionId: session.id, url: session.url };
});
