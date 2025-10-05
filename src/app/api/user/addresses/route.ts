import prisma from "@/db";
import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Ulica jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
  country: z.string().min(1, "Kraj jest wymagany"),
  phoneNumber: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
  addressType: z.enum(["BILLING", "SHIPPING", "BOTH"]).optional().default("BOTH"),
});

export const GET = createRouteHandler(
  async ({ session }) => {
    if (!session?.user?.id) throw new ApiError("Unauthorized", 401);
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return addresses;
  },
  { auth: "user" }
);

export const POST = createRouteHandler(
  async ({ session, req }) => {
    if (!session?.user?.id) throw new ApiError("Unauthorized", 401);
    const payload = await readJson(req);
    const result = addressSchema.safeParse(payload);
    if (!result.success)
      throw new ApiError("Nieprawidłowe dane adresu", 400, result.error.flatten());
    const data = result.data;

    // Ensure the user exists (after a dev DB reset, a stale session may exist)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });
    if (!userExists) {
      throw new ApiError("Użytkownik nie istnieje. Zaloguj się ponownie.", 401);
    }

    // If setting default, unset previous defaults of same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, addressType: data.addressType, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phoneNumber: data.phoneNumber || null,
        isDefault: data.isDefault,
        addressType: data.addressType,
      },
    });

    return address;
  },
  { auth: "user" }
);
