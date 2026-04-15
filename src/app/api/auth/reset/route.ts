import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import crypto from "crypto";
import { hashPassword, verifyPassword } from "@/lib/auth-server";
import { resetLimiter, getClientIp } from "@/lib/rate-limit";

type Body = { token: string; password: string };

export const POST = createRouteHandler(async ({ req }) => {
  const { token, password } = await readJson<Body>(req);
  if (!token || !password) throw new ApiError("token and password are required", 400);
  if (password.length < 6) throw new ApiError("Hasło musi mieć co najmniej 6 znaków", 400);

  const ip = getClientIp(req);
  const check = await resetLimiter.limit(ip);
  if (!check.success) throw new ApiError("Za dużo prób, spróbuj później", 429);

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new ApiError("Invalid or expired token", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: record.userId },
    select: { password: true },
  });
  if (!user) throw new ApiError("Invalid or expired token", 400);

  const sameAsOld = await verifyPassword(password, user.password);
  if (sameAsOld) {
    throw new ApiError("Nowe hasło musi być inne niż dotychczasowe", 400);
  }

  const hashed = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
});
