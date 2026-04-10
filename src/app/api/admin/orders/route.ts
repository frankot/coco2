import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";
import { ORDER_LIST_SELECT } from "@/lib/selects";

const DEFAULT_LIMIT = 50;

export const GET = createRouteHandler(
  async ({ req }) => {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const limit = DEFAULT_LIMIT;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        select: ORDER_LIST_SELECT,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.order.count(),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  { auth: "admin" }
);
