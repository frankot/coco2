import { ApiError, createRouteHandler, getRequiredParam } from "@/lib/api";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";

export const GET = createRouteHandler(async ({ params }) => {
  const id = getRequiredParam(params as any, "id");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError("Product not found", 404);

  const session = await getServerSession(authOptions);
  const [resolved] = await resolveProductPrices([product], session?.user?.id);
  return resolved;
});
