import { createRouteHandler, ApiError } from "@/lib/api";
import prisma from "@/db";
import { ORDER_LIST_SELECT } from "@/lib/selects";
import type { Prisma } from "@/app/generated/prisma/client";

const DEFAULT_LIMIT = 50;

const SORT_FIELDS = ["createdAt", "paidAt", "status", "totalAmount", "totalItems"] as const;
type SortField = (typeof SORT_FIELDS)[number];
const SORT_DIRS = ["asc", "desc"] as const;
type SortDir = (typeof SORT_DIRS)[number];

function buildOrderBy(field: SortField, dir: SortDir): Prisma.OrderOrderByWithRelationInput {
  switch (field) {
    case "paidAt":
      return { paidAt: { sort: dir, nulls: "last" } };
    case "totalAmount":
      return { pricePaidInCents: dir };
    case "totalItems":
      return { orderItems: { _count: dir } };
    case "status":
      return { status: dir };
    case "createdAt":
    default:
      return { createdAt: dir };
  }
}

export const GET = createRouteHandler(
  async ({ req }) => {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const limit = DEFAULT_LIMIT;

    const sortFieldParam = (url.searchParams.get("sortField") || "createdAt") as SortField;
    const sortDirParam = (url.searchParams.get("sortDir") || "desc") as SortDir;

    if (!SORT_FIELDS.includes(sortFieldParam)) {
      throw new ApiError(`Invalid sortField: ${sortFieldParam}`, 400);
    }
    if (!SORT_DIRS.includes(sortDirParam)) {
      throw new ApiError(`Invalid sortDir: ${sortDirParam}`, 400);
    }

    const orderBy = buildOrderBy(sortFieldParam, sortDirParam);

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        select: ORDER_LIST_SELECT,
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.order.count(),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  { auth: "admin" }
);
