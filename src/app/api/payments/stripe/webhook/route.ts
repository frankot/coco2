import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { createRouteHandler, ApiError } from "@/lib/api";
import { confirmStripePayment } from "@/lib/confirm-stripe-payment";

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
    const orderId = session.metadata?.orderId;
    if (!orderId) throw new ApiError("Missing orderId on session metadata", 400);
    const piId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    const didTransition = await confirmStripePayment(orderId, piId);
    return { received: true, skipped: !didTransition };
  }
  return { received: true };
});
