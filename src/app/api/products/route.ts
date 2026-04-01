import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";

export const GET = createRouteHandler(async () => {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
  });

  const session = await getServerSession(authOptions);
  return resolveProductPrices(products, session?.user?.id);
});
