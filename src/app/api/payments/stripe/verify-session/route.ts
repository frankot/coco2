import { stripe } from "@/lib/stripe";
import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { confirmStripePayment } from "@/lib/confirm-stripe-payment";
import { logWarn } from "@/lib/logger";

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { sessionId, orderId, token } = body as {
    sessionId?: string;
    orderId?: string;
    token?: string;
  };
  if (!sessionId || !orderId) throw new ApiError("sessionId and orderId are required", 400);

  const session = await stripe.checkout.sessions.retrieve(sessionId as string, {
    expand: ["payment_intent"],
  });

  if (session.metadata?.orderId !== orderId) {
    throw new ApiError("Session does not match the provided order", 403);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError("Not found", 404);

  // Authorize: signed-in owner OR access token (hash match). We intentionally do
  // not burn the token here — React StrictMode + reloads would fail the second
  // call. The token is a URL secret; hash comparison is sufficient for a
  // read-only verify endpoint.
  const auth = await getServerSession(authOptions);
  const isOwner = auth?.user?.id && auth.user.id === order.userId;
  let tokenOk = false;
  if (!isOwner && token && order.accessTokenHash) {
    const provided = crypto.createHash("sha256").update(token).digest("hex");
    tokenOk = provided === order.accessTokenHash;
  }
  if (!isOwner && !tokenOk) throw new ApiError("Not found", 404);

  const paid = session.payment_status === "paid" || session.status === "complete";
  if (!paid) {
    return { success: false, paid: false };
  }

  // Fallback writer: if the webhook hasn't finalized the order yet (common in
  // local sandboxes without `stripe listen`), transition it here. The helper is
  // idempotent — if the webhook already ran, this is a no-op.
  const piId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as any)?.id ?? null;
  await confirmStripePayment(orderId, piId);

  const payment = await prisma.payment.findFirst({ where: { orderId } });

  let receiptUrl: string | undefined;
  try {
    const pi = typeof session.payment_intent === "string" ? null : (session.payment_intent as any);
    const charges = pi?.charges?.data ?? [];
    if (charges.length > 0) {
      const latest = charges[0];
      receiptUrl = latest?.receipt_url || latest?.receipt?.url || undefined;
    }
  } catch (e) {
    logWarn("verifySession.receiptExtract", "could not extract receipt url", { orderId });
  }

  return {
    success: true,
    paid: true,
    pending: payment?.status !== "COMPLETED",
    receiptUrl,
  };
});
