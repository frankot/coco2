import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";

export const GET = createRouteHandler(
  async () => {
    return prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        discountType: true,
        discountAmount: true,
        isActive: true,
        isSingleUse: true,
        usedCount: true,
        createdAt: true,
      },
    });
  },
  { auth: "admin" }
);
