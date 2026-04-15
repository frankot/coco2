import { stripe } from "@/lib/stripe";
import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import crypto from "crypto";
import { generateAndSendInvoice } from "@/lib/invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logError, logWarn } from "@/lib/logger";

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

  // Authorize: signed-in owner OR one-time access token
  const auth = await getServerSession(authOptions);
  const isOwner = auth?.user?.id && auth.user.id === order.userId;
  let tokenOk = false;
  if (!isOwner && token && order.accessTokenHash && !order.accessTokenUsedAt) {
    const provided = crypto.createHash("sha256").update(token).digest("hex");
    tokenOk = provided === order.accessTokenHash;
  }
  if (!isOwner && !tokenOk) throw new ApiError("Not found", 404);

  // Burn the token after first use (only when used as auth)
  if (tokenOk) {
    await prisma.order.update({
      where: { id: orderId },
      data: { accessTokenUsedAt: new Date() },
    });
  }

  const paid = session.payment_status === "paid" || session.status === "complete";
  if (!paid) {
    return { success: false, paid: false };
  }

  // Webhook is the canonical writer for Order.status / Payment.status.
  // verify-session is read-only: re-read and report state to the client.
  const payment = await prisma.payment.findFirst({ where: { orderId } });

  // Best-effort invoice generation (idempotent — webhook also calls this).
  generateAndSendInvoice(orderId as string).catch((e) => {
    logError("verifySession.generateInvoice", e, { orderId });
  });

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
