import { ApiError, createRouteHandler, getRequiredParam } from "@/lib/api";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";

export const GET = createRouteHandler(async ({ params }) => {
  const id = getRequiredParam(params as any, "id");
  // Support lookup by slug or UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const product = isUuid
    ? await prisma.product.findUnique({ where: { id } })
    : await prisma.product.findUnique({ where: { slug: id } });
  if (!product || !product.isVisible) throw new ApiError("Product not found", 404);

  const session = await getServerSession(authOptions);
  const accountType = session?.user?.accountType;

  // Visibility check (guests treated as DETAL)
  if (
    ((!accountType || accountType === "DETAL") && !product.visibleToDetal) ||
    (accountType === "DETAL_B2B" && (!product.visibleToDetalB2B || product.isPreorder)) ||
    (accountType === "HURT" && (!product.visibleToHurt || product.isPreorder))
  ) {
    throw new ApiError("Product not found", 404);
  }

  const [resolved] = await resolveProductPrices([product], session?.user?.id);
  return resolved;
});
