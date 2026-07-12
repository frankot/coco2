import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";

export const GET = createRouteHandler(async () => {
  const session = await getServerSession(authOptions);
  const accountType = session?.user?.accountType;

  // Visibility filter based on account type (guests treated as DETAL)
  const where: any = { isVisible: true };
  if (!accountType || accountType === "DETAL") where.visibleToDetal = true;
  else if (accountType === "DETAL_B2B") {
    where.visibleToDetalB2B = true;
    where.isPreorder = false;
  } else if (accountType === "HURT") {
    where.visibleToHurt = true;
    where.isPreorder = false;
  }
  // ADMIN sees all available products

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return resolveProductPrices(products, session?.user?.id);
});
