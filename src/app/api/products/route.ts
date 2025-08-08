import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";

export const GET = createRouteHandler(async () => {
  return prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
  });
});
