import crypto from "crypto";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { ApiError, createRouteHandler, getRequiredParam, readJson } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import {
  availabilityNotificationEmailLimiter,
  availabilityNotificationIpLimiter,
  availabilityNotificationProductLimiter,
  getClientIp,
} from "@/lib/rate-limit";

const GENERIC_MESSAGE = "Jeśli adres jest poprawny, wyślemy powiadomienie o dostępności.";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Niepoprawny adres email"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Zgoda jest wymagana" }),
  }),
});

export const POST = createRouteHandler(async ({ req, params, prisma }) => {
  const productId = getRequiredParam(params as any, "id");
  const body = await readJson(req);
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new ApiError("Nieprawidłowe dane", 400, result.error.flatten());
  }

  const { email } = result.data;
  const ip = getClientIp(req);
  const [ipCheck, emailCheck, productCheck] = await Promise.all([
    availabilityNotificationIpLimiter.limit(ip),
    availabilityNotificationEmailLimiter.limit(email),
    availabilityNotificationProductLimiter.limit(productId),
  ]);

  if (!ipCheck.success || !emailCheck.success || !productCheck.success) {
    return { success: true, message: GENERIC_MESSAGE };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, isVisible: true, isAvailable: true },
  });

  if (!product || !product.isVisible || product.isAvailable) {
    return { success: true, message: GENERIC_MESSAGE };
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.role === "USER" ? session.user.id : undefined;
  const rawToken = crypto.randomBytes(32).toString("hex");
  const unsubscribeTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.productAvailabilityNotification.upsert({
    where: {
      productId_email_status: {
        productId,
        email,
        status: "ACTIVE",
      },
    },
    create: {
      productId,
      email,
      userId,
      unsubscribeTokenHash,
    },
    update: userId ? { userId } : {},
  });

  await sendMail({
    to: email,
    subject: `Powiadomienie o dostępności: ${product.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.5;color:#111827;">
        <h1 style="font-size:22px;margin:0 0 16px;">Zapisaliśmy Twoje powiadomienie</h1>
        <p style="margin:0 0 12px;">Damy znać, gdy produkt <strong>${product.name}</strong> będzie ponownie dostępny.</p>
        <p style="margin:0;color:#6b7280;font-size:13px;">Jeśli to nie Ty wysłałeś prośbę, zignoruj tę wiadomość.</p>
      </div>
    `,
  });

  return { success: true, message: GENERIC_MESSAGE };
});
