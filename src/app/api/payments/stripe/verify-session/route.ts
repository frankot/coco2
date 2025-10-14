import { stripe } from "@/lib/stripe";
import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";

// Optional email sending via nodemailer when SMTP env vars are configured
async function sendConfirmationEmail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from =
    process.env.FROM_EMAIL ||
    `no-reply@${process.env.NEXT_PUBLIC_URL?.replace(/^https?:\/\//, "") || "example.com"}`;
  if (!host || !port || !user || !pass) {
    console.log("SMTP not configured, skipping email to", to);
    return;
  }
  try {
    // Avoid static require so bundler doesn't fail when nodemailer isn't installed.
    // Use eval to call require at runtime.
    // eslint-disable-next-line no-eval
    const req: any = eval("require");
    const nodemailer = req("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({ from, to, subject, html });
    console.log("Sent confirmation email to", to);
  } catch (e) {
    console.error("Failed to send confirmation email", e);
  }
}

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { sessionId, orderId } = body as { sessionId?: string; orderId?: string };
  if (!sessionId || !orderId) throw new ApiError("sessionId and orderId are required", 400);

  // Retrieve session
  const session = await stripe.checkout.sessions.retrieve(sessionId as string, {
    expand: ["payment_intent"],
  });

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
      await sendConfirmationEmail(
        order.user.email,
        `Potwierdzenie płatności zamówienia ${order.id}`,
        html
      );
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
