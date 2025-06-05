import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature || !webhookSecret) {
      throw new Error("Missing required webhook headers or secret");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata.orderId;

      // Find the payment record first
      const payment = await prisma.payment.findFirst({
        where: { orderId: orderId },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Update order and payment status
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { status: "PROCESSING" },
        }),
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            transactionId: session.payment_intent,
          },
        }),
      ]);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
