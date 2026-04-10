import prisma from "@/db";
import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { getOrigin } from "@/lib/get-origin";
import { stripe } from "@/lib/stripe";

export const POST = createRouteHandler(
  async ({ req, session }) => {
    if (!session?.user?.email) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await readJson<{ orderId?: string }>(req);
    const orderId = body.orderId?.trim();

    if (!orderId) {
      throw new ApiError("orderId is required", 400);
    }

    const origin = getOrigin();
    if (!origin) {
      throw new ApiError("No origin found", 500);
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user: { email: session.user.email },
      },
      select: {
        id: true,
        status: true,
        paymentMethod: true,
        discountAmountInCents: true,
        discountCodeValue: true,
        orderItems: {
          select: {
            quantity: true,
            pricePerItemInCents: true,
            product: {
              select: {
                name: true,
                imagePaths: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    if (order.paymentMethod !== "STRIPE") {
      throw new ApiError("This order does not use online payment", 400);
    }

    if (order.status !== "PENDING") {
      throw new ApiError("Only pending orders can be paid again", 400);
    }

    if (order.orderItems.length === 0) {
      throw new ApiError("Order has no items", 400);
    }

    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: "pln",
        product_data: {
          name: item.product.name,
          images: item.product.imagePaths.length > 0 ? [item.product.imagePaths[0]] : [],
        },
        unit_amount: item.pricePerItemInCents,
      },
      quantity: item.quantity,
    }));

    let discounts: { coupon: string }[] = [];
    if (order.discountAmountInCents && order.discountAmountInCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: order.discountAmountInCents,
        currency: "pln",
        duration: "once",
        name: `Rabat: ${order.discountCodeValue || "kod"}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      mode: "payment",
      locale: "pl",
      line_items: lineItems,
      ...(discounts.length > 0 ? { discounts } : {}),
      ...(order.user.email
        ? {
            customer_email: order.user.email,
            payment_intent_data: { receipt_email: order.user.email },
          }
        : {}),
      success_url: `${origin}/kasa/zlozone-zamowienie/${order.id}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/uzytkownik/${order.id}?canceled=true`,
      metadata: { orderId: order.id },
    });

    return { url: checkoutSession.url };
  },
  { auth: "user" }
);
