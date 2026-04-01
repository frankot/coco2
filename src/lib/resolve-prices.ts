import prisma from "@/db";

export async function getCustomPriceMap(userId: string): Promise<Map<string, number>> {
  const customPrices = await prisma.customPrice.findMany({
    where: { userId },
    select: { productId: true, priceInCents: true },
  });
  return new Map(customPrices.map((cp) => [cp.productId, cp.priceInCents]));
}

export async function resolveProductPrices<T extends { id: string; priceInCents: number }>(
  products: T[],
  userId?: string | null
): Promise<T[]> {
  if (!userId || products.length === 0) return products;
  const customMap = await getCustomPriceMap(userId);
  return products.map((p) => ({
    ...p,
    priceInCents: customMap.get(p.id) ?? p.priceInCents,
  }));
}
