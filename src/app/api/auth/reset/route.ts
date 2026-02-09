import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import prisma from "@/db";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/lib/auth-server";

type Body = { token: string; password: string };

export const POST = createRouteHandler(async ({ req }) => {
  const { token, password } = await readJson<Body>(req);
  if (!token || !password) throw new ApiError("token and password are required", 400);

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new ApiError("Server misconfiguration: missing NEXTAUTH_SECRET", 500);
  let payload: any;
  try {
    payload = jwt.verify(token, secret) as any;
  } catch (e) {
    throw new ApiError("Invalid or expired token", 400);
  }

  const userId = payload?.sub;
  if (!userId) throw new ApiError("Invalid token payload", 400);

  const hashed = await hashPassword(password);
  await prisma.user.update({ where: { id: String(userId) }, data: { password: hashed } });

  return { success: true };
});
