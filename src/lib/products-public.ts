import { cache } from "react";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";
import type { Prisma, Product } from "@/app/generated/prisma/client";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Session (deduped per request)
export const getViewerSession = cache(() => getServerSession(authOptions));

// Raw product by UUID or slug (deduped per request)
export const getProductByIdOrSlug = cache(async (idOrSlug: string) =>
  UUID_RE.test(idOrSlug)
    ? prisma.product.findUnique({ where: { id: idOrSlug } })
    : prisma.product.findUnique({ where: { slug: idOrSlug } })
);

// Visibility filter (guests treated as DETAL, ADMIN sees all)
function visibilityWhere(accountType?: string | null): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isVisible: true };
  if (!accountType || accountType === "DETAL") where.visibleToDetal = true;
  else if (accountType === "DETAL_B2B") {
    where.visibleToDetalB2B = true;
    where.isPreorder = false;
  } else if (accountType === "HURT") {
    where.visibleToHurt = true;
    where.isPreorder = false;
  }
  return where;
}

function isVisibleTo(product: Product, accountType?: string | null) {
  if (!product.isVisible) return false;
  if (!accountType || accountType === "DETAL") return product.visibleToDetal;
  if (accountType === "DETAL_B2B") return product.visibleToDetalB2B && !product.isPreorder;
  if (accountType === "HURT") return product.visibleToHurt && !product.isPreorder;
  return true;
}

// Product list for current viewer
export async function getVisibleProducts(): Promise<Product[]> {
  const session = await getViewerSession();
  const products = await prisma.product.findMany({
    where: visibilityWhere(session?.user?.accountType),
    orderBy: { createdAt: "desc" },
  });
  return resolveProductPrices(products, session?.user?.id);
}

// Single product for current viewer
export async function getVisibleProduct(idOrSlug: string): Promise<Product | null> {
  const product = await getProductByIdOrSlug(idOrSlug);
  if (!product) return null;
  const session = await getViewerSession();
  if (!isVisibleTo(product, session?.user?.accountType)) return null;
  const [resolved] = await resolveProductPrices([product], session?.user?.id);
  return resolved;
}
