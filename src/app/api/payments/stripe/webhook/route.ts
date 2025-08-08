import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { createRouteHandler, ApiError } from "@/lib/api";
import prisma from "@/db";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const POST = createRouteHandler(async ({ req }) => {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature || !webhookSecret)
    throw new ApiError("Missing required webhook headers or secret", 400);
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    throw new ApiError("Invalid signature", 400);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata.orderId;
    const payment = await prisma.payment.findFirst({ where: { orderId } });
    if (!payment) throw new ApiError("Payment not found", 404);
    await prisma.$transaction([
      prisma.order.update({ where: { id: orderId }, data: { status: "PROCESSING" } }),
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED", transactionId: session.payment_intent },
      }),
    ]);
  }
  return { received: true };
});
