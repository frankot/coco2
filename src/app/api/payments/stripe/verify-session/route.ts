import { stripe } from "@/lib/stripe";
import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import mailer from "@/lib/mailer";

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { sessionId, orderId } = body as { sessionId?: string; orderId?: string };
  if (!sessionId || !orderId) throw new ApiError("sessionId and orderId are required", 400);

  // Retrieve session
  const session = await stripe.checkout.sessions.retrieve(sessionId as string, {
    expand: ["payment_intent"],
  });

  // Verify the session actually belongs to this order
  if (session.metadata?.orderId !== orderId) {
    throw new ApiError("Session does not match the provided order", 403);
  }

  // Check payment status
  const paid = session.payment_status === "paid" || session.status === "complete";

  if (!paid) {
    return { success: false, paid: false, session };
  }

  // Find payment record
  const payment = await prisma.payment.findFirst({ where: { orderId } });
  if (!payment) throw new ApiError("Payment record not found for order", 404);

  // Update DB: mark payment completed and order progressed to PROCESSING
  // Use payment_intent id (string) if payment_intent was expanded as object
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as any)?.id;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED", transactionId: paymentIntentId ?? undefined },
    }),
    // Mark order as PAID when Stripe confirms payment
    prisma.order.update({ where: { id: orderId }, data: { status: "PAID" as any } }),
  ]);

  // Send confirmation email to customer (if configured)
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (order?.user?.email) {
      const html = `<p>Dzień dobry ${order.user.firstName ?? ""},</p>
        <p>Dziękujemy za zamówienie <strong>${order.id}</strong>. Płatność została zaksięgowana.</p>
        <p>Pozdrawiamy,<br/>Zespół</p>`;
      await mailer.sendMail({
        to: order.user.email,
        subject: `Potwierdzenie płatności zamówienia ${order.id}`,
        html,
      });
    }
  } catch (e) {
    console.error("Failed to send confirmation email after verifying session", e);
  }

  // Try to find a receipt URL on the PaymentIntent's charges (if expanded)
  let receiptUrl: string | undefined;
  try {
    const pi = typeof session.payment_intent === "string" ? null : (session.payment_intent as any);
    const charges = pi?.charges?.data ?? [];
    if (charges.length > 0) {
      // Prefer the latest charge
      const latest = charges[0];
      receiptUrl = latest?.receipt_url || latest?.receipt?.url || undefined;
    }
  } catch (e) {
    console.warn("Could not extract receipt URL from payment intent", e);
  }

  return { success: true, paid: true, receiptUrl };
});
