import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";

const DEFAULT_LIMIT = 50;

export const GET = createRouteHandler(
  async ({ req }) => {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const limit = DEFAULT_LIMIT;

    const [data, total] = await Promise.all([
      prisma.discountCode.findMany({
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
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.discountCode.count(),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  { auth: "admin" }
);
