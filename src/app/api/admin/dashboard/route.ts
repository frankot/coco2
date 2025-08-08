import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";

export const GET = createRouteHandler(
  async () => {
    const [productsCount, usersCount] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
    ]);
    return { productsCount, usersCount };
  },
  { auth: "admin" }
);
