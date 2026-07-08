import prisma from "@/db";
import mailer from "@/lib/mailer";
import { generateAndSendInvoice } from "@/lib/invoice";
import { renderEmailLayout } from "@/lib/email-layout";
import { logError } from "@/lib/logger";
import { confirmOrderInApaczka } from "@/lib/apaczka-confirm";

// Atomically transition a Stripe order PENDING -> PAID.
// Safe to call concurrently from the Stripe webhook and /verify-session — only
// the caller that flips payment.status wins the race and triggers side effects
// (invoice + confirmation email). Returns true if this caller did the work.
export async function confirmStripePayment(
  orderId: string,
  paymentIntentId: string | null
): Promise<boolean> {
  const payment = await prisma.payment.findFirst({ where: { orderId } });
  if (!payment) return false;
  if (payment.status === "COMPLETED") return false;

  // Atomic check-and-set: only one concurrent caller succeeds.
  const locked = await prisma.payment.updateMany({
    where: { id: payment.id, status: "PENDING" },
    data: {
      status: "COMPLETED",
      ...(paymentIntentId ? { transactionId: paymentIntentId } : {}),
    },
  });
  if (locked.count === 0) return false;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      discountCodeId: true,
      isB2BManual: true,
      paymentMethod: true,
      shippingServiceId: true,
      apaczkaOrderId: true,
      user: { select: { email: true, firstName: true, accountType: true } },
    },
  });

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID", paidAt: new Date() },
    }),
    ...(order?.discountCodeId
      ? [
          prisma.discountCode.update({
            where: { id: order.discountCodeId },
            data: { usedCount: { increment: 1 } },
          }),
        ]
      : []),
  ]);

  // Auto invoice generation after successful Stripe payment
  if (!order?.isB2BManual) {
    generateAndSendInvoice(orderId).catch((e) => {
      logError("confirmStripePayment.invoice", e, { orderId });
    });
  }

  // Apaczka Automation
  if (
    order?.user?.accountType === "DETAL" &&
    !order.isB2BManual &&
    order.paymentMethod === "STRIPE" &&
    order.shippingServiceId &&
    !order.apaczkaOrderId
  ) {
    try {
      await confirmOrderInApaczka(orderId);
    } catch (e) {
      logError("confirmStripePayment.apaczka", e, { orderId });
    }
  }

  try {
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
    logError("confirmStripePayment.email", e, { orderId });
  }

  return true;
}
