import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import mailer from "@/lib/mailer";
import crypto from "crypto";
import { getOrigin } from "@/lib/get-origin";
import { renderEmailLayout } from "@/lib/email-layout";
import { forgotIpLimiter, forgotEmailLimiter, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

type Body = { email: string };

const TOKEN_TTL_MS = 60 * 60 * 1000;

export const POST = createRouteHandler(async ({ req }) => {
  const { email } = await readJson<Body>(req);
  if (!email) throw new ApiError("Email is required", 400);

  const ip = getClientIp(req);
  const ipCheck = await forgotIpLimiter.limit(ip);
  if (!ipCheck.success) throw new ApiError("Za dużo prób, spróbuj później", 429);
  const emailCheck = await forgotEmailLimiter.limit(email.toLowerCase());
  if (!emailCheck.success) throw new ApiError("Za dużo prób, spróbuj później", 429);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // don't reveal whether the email exists
    return { success: true };
  }

  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  // Invalidate any prior unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const siteUrl = getOrigin();
  const resetUrl = `${siteUrl.replace(/\/$/, "")}/auth/reset?token=${encodeURIComponent(raw)}`;

  const body = `
    <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Otrzymaliśmy prośbę o zresetowanie hasła do konta <strong>${user.email}</strong>.</p>
    <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Kliknij poniższy przycisk aby ustawić nowe hasło (link ważny 1 godzinę).</p>
    <p style="margin:0;font-size:14px;color:#2b6a4b;">Jeśli nie prosiłeś o zresetowanie hasła, zignoruj tę wiadomość.</p>
  `;

  const html = renderEmailLayout({
    title: "Resetowanie hasła",
    intro: "Otrzymaliśmy prośbę o zmianę hasła do Twojego konta.",
    body,
    ctaLabel: "Zresetuj hasło",
    ctaHref: resetUrl,
  });

  try {
    await mailer.sendMail({ to: user.email, subject: "Resetowanie hasła", html });
  } catch (e) {
    logError("auth.forgot.sendMail", e, { userId: user.id });
  }

  return { success: true };
});
