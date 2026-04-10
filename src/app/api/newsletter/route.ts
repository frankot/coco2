import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Niepoprawny adres email"),
});

export const POST = createRouteHandler(async ({ req, prisma }) => {
  const body = await readJson(req);
  const { email } = newsletterSchema.parse(body);

  await prisma.newsletterEmail.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  return { message: "Zapisano do newslettera" };
});
