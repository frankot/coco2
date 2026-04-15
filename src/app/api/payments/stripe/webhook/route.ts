import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { createRouteHandler, ApiError } from "@/lib/api";
import prisma from "@/db";
import mailer from "@/lib/mailer";
import { generateAndSendInvoice } from "@/lib/invoice";
import { renderEmailLayout } from "@/lib/email-layout";
import { logError } from "@/lib/logger";

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
    // Idempotency: skip if already processed
    if (payment.status === "COMPLETED") {
      return { received: true, skipped: true };
    }
    await prisma.$transaction([
      prisma.order.update({ where: { id: orderId }, data: { status: "PAID", paidAt: new Date() } }),
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED", transactionId: session.payment_intent },
      }),
    ]);

    // Generate wFirma invoice on payment confirmation
    generateAndSendInvoice(orderId).catch((e) => {
      logError("stripe.webhook.generateInvoice", e, { orderId });
    });

    // Send confirmation email (moved from verify-session so we have a single writer)
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });
      if (order?.user?.email) {
        const emailBody = `
          <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Cześć ${order.user.firstName ?? ""},</p>
          <p style="margin:0;font-size:14px;color:#0d160f;">Dziękujemy za zamówienie <strong style="font-family:ui-monospace,Menlo,Monaco,monospace;">${order.id}</strong>. Płatność została zaksięgowana.</p>
        `;
        const html = renderEmailLayout({
          title: "Płatność potwierdzona",
          intro: "Twoja płatność została pomyślnie zaksięgowana.",
          body: emailBody,
        });
        await mailer.sendMail({
          to: order.user.email,
          subject: `Potwierdzenie płatności zamówienia ${order.id}`,
          html,
        });
      }
    } catch (e) {
      logError("stripe.webhook.confirmationEmail", e, { orderId });
    }
  }
  return { received: true };
});
