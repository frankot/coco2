import { ApiError, createRouteHandler, getRequiredParam } from "@/lib/api";
import prisma from "@/db";

export const GET = createRouteHandler(async ({ params }) => {
  const id = getRequiredParam(params as any, "id");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError("Product not found", 404);
  return product;
});
