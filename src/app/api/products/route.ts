import { createRouteHandler } from "@/lib/api";
import { getVisibleProducts } from "@/lib/products-public";

export const GET = createRouteHandler(async () => getVisibleProducts());
