import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { registerUser } from "@/lib/auth-utils";

export const POST = createRouteHandler(async ({ req, prisma }) => {
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
