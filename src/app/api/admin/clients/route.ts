import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";
import { CLIENT_LIST_SELECT } from "@/lib/selects";
import type { Prisma } from "@/app/generated/prisma/client";

const DEFAULT_LIMIT = 50;

export const GET = createRouteHandler(
  async ({ req }) => {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const limit = DEFAULT_LIMIT;
    const search = url.searchParams.get("search")?.trim() || undefined;

    const where: Prisma.UserWhereInput | undefined = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: CLIENT_LIST_SELECT,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  { auth: "admin" }
);
