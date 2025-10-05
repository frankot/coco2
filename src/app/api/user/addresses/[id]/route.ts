import prisma from "@/db";
import { createRouteHandler, ApiError, getRequiredParam, readJson } from "@/lib/api";
import { z } from "zod";

const addressUpdateSchema = z.object({
  street: z.string().min(1, "Ulica jest wymagana").optional(),
  city: z.string().min(1, "Miasto jest wymagane").optional(),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany").optional(),
  country: z.string().min(1, "Kraj jest wymagany").optional(),
  isDefault: z.boolean().optional(),
  addressType: z.enum(["BILLING", "SHIPPING", "BOTH"]).optional(),
});

export const PATCH = createRouteHandler(
  async ({ session, params, req }) => {
    if (!session?.user?.id) throw new ApiError("Unauthorized", 401);
    const id = getRequiredParam(params as any, "id");
    const payload = await readJson(req);
    const result = addressUpdateSchema.safeParse(payload);
    if (!result.success)
      throw new ApiError("Nieprawidłowe dane adresu", 400, result.error.flatten());
    const data = result.data;

    // Ensure address belongs to user
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) throw new ApiError("Not found", 404);

    // If setting default, unset previous defaults of same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          addressType: data.addressType ?? existing.addressType,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data,
    });
    return updated;
  },
  { auth: "user" }
);

export const DELETE = createRouteHandler(
  async ({ session, params }) => {
    if (!session?.user?.id) throw new ApiError("Unauthorized", 401);
    const id = getRequiredParam(params as any, "id");

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) throw new ApiError("Not found", 404);

    // Check not used by existing orders (optional, but safer)
    const usedByOrder = await prisma.order.findFirst({
      where: { OR: [{ billingAddressId: id }, { shippingAddressId: id }] },
      select: { id: true },
    });
    if (usedByOrder) throw new ApiError("Nie można usunąć adresu używanego w zamówieniach", 400);

    await prisma.address.delete({ where: { id } });
    return { success: true };
  },
  { auth: "user" }
);
