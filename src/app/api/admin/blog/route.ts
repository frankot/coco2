import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";

const DEFAULT_LIMIT = 50;

export const GET = createRouteHandler(
  async ({ req }) => {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const limit = DEFAULT_LIMIT;

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        select: { id: true, title: true, slug: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.blogPost.count(),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  { auth: "admin" }
);
