import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";
import { PRODUCT_LIST_SELECT } from "@/lib/selects";

export const GET = createRouteHandler(
  async () => {
    return prisma.product.findMany({
      select: PRODUCT_LIST_SELECT,
      orderBy: { createdAt: "desc" },
    });
  },
  { auth: "admin" }
);
