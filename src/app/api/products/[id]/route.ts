import { ApiError, createRouteHandler, getRequiredParam } from "@/lib/api";
import { getVisibleProduct } from "@/lib/products-public";

export const GET = createRouteHandler(async ({ params }) => {
  const id = getRequiredParam(params as any, "id");
  const product = await getVisibleProduct(id);
  if (!product) throw new ApiError("Product not found", 404);
  return product;
});
