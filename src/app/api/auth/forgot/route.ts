import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import mailer from "@/lib/mailer";
import jwt from "jsonwebtoken";
import { getOrigin } from "@/lib/get-origin";
import { renderEmailLayout } from "@/lib/email-layout";

type Body = { email: string };

export const POST = createRouteHandler(async ({ req }) => {
  const { email } = await readJson<Body>(req);
  if (!email) throw new ApiError("Email is required", 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // don't reveal whether the email exists
    return { success: true };
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new ApiError("Server misconfiguration: missing NEXTAUTH_SECRET", 500);
  const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: "1h" });

  const siteUrl = getOrigin();
  const resetUrl = `${siteUrl.replace(/\/$/, "")}/auth/reset?token=${encodeURIComponent(token)}`;

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
    console.error("Failed to send password reset email", e);
  }

  return { success: true };
});
