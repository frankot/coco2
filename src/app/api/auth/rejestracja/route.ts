import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { registerUser } from "@/lib/auth-utils";
import { registerLimiter, getClientIp } from "@/lib/rate-limit";

export const POST = createRouteHandler(async ({ req, prisma }) => {
  const ip = getClientIp(req);
  const check = await registerLimiter.limit(ip);
  if (!check.success) throw new ApiError("Za dużo prób, spróbuj później", 429);

  const body = await readJson(req);
  const { email, password, firstName, lastName, newsletterConsent } = body;
  const result = await registerUser({ email, password, firstName, lastName });
  if (!result.success) throw new ApiError(result.message, 400);

  // Newsletter opt-in
  if (newsletterConsent && email) {
    await prisma.newsletterEmail.upsert({
      where: { email },
      create: { email },
      update: {},
    });
  }

  return { message: result.message, userId: result.userId };
});
