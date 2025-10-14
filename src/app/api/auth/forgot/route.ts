import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import mailer from "@/lib/mailer";
import jwt from "jsonwebtoken";

type Body = { email: string };

export const POST = createRouteHandler(async ({ req }) => {
  const { email } = await readJson<Body>(req);
  if (!email) throw new ApiError("Email is required", 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // don't reveal whether the email exists
    return { success: true };
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.SECRET || "secret";
  const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: "1h" });

  const siteUrl =
    process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${siteUrl.replace(/\/$/, "")}/auth/reset?token=${encodeURIComponent(token)}`;

  const html = `<p>Dzień dobry,</p>
    <p>Otrzymaliśmy prośbę o zresetowanie hasła do konta <strong>${user.email}</strong>.</p>
    <p>Kliknij poniższy przycisk aby ustawić nowe hasło (link ważny 1 godzinę):</p>
    <p><a href="${resetUrl}" style="background:#111827;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;">Zresetuj hasło</a></p>
    <p>Jeśli nie prosiłeś o zresetowanie hasła, zignoruj tę wiadomość.</p>
    <p>Pozdrawiamy,<br/>Zespół</p>`;

  try {
    await mailer.sendMail({ to: user.email, subject: "Resetowanie hasła", html });
  } catch (e) {
    console.error("Failed to send password reset email", e);
  }

  return { success: true };
});
