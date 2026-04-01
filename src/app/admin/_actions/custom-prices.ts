"use server";

import prisma from "@/db";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";

const upsertSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  priceInCents: z.number().int().min(0),
});

export async function upsertCustomPrice(data: {
  userId: string;
  productId: string;
  priceInCents: number;
}): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();
    const validated = upsertSchema.parse(data);

    await prisma.customPrice.upsert({
      where: {
        userId_productId: {
          userId: validated.userId,
          productId: validated.productId,
        },
      },
      create: validated,
      update: { priceInCents: validated.priceInCents },
    });

    return { success: true, message: "Cena została zapisana" };
  } catch (error) {
    console.error("Error upserting custom price:", error);
    return { success: false, message: "Wystąpił błąd podczas zapisywania ceny" };
  }
}

export async function deleteCustomPrice(
  userId: string,
  productId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();

    await prisma.customPrice.delete({
      where: { userId_productId: { userId, productId } },
    });

    return { success: true, message: "Cena indywidualna została usunięta" };
  } catch (error) {
    console.error("Error deleting custom price:", error);
    return { success: false, message: "Wystąpił błąd podczas usuwania ceny" };
  }
}

export async function getCustomPricesForUser(userId: string) {
  await requireAdmin();

  return prisma.customPrice.findMany({
    where: { userId },
    select: {
      productId: true,
      priceInCents: true,
    },
  });
}

export async function getActiveProductsWithCustomPrices(userId: string) {
  await requireAdmin();

  const [products, customPrices] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      select: { id: true, name: true, priceInCents: true, imagePaths: true },
      orderBy: { name: "asc" },
    }),
    prisma.customPrice.findMany({
      where: { userId },
      select: { productId: true, priceInCents: true },
    }),
  ]);

  const customMap = new Map(customPrices.map((cp) => [cp.productId, cp.priceInCents]));

  return products.map((p) => ({
    ...p,
    customPriceInCents: customMap.get(p.id) ?? null,
  }));
}
