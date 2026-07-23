import { createRouteHandler, ApiError } from "@/lib/api";
import prisma from "@/db";
import { ORDER_LIST_SELECT } from "@/lib/selects";
import type { Prisma } from "@/app/generated/prisma/client";

const DEFAULT_LIMIT = 50;

const SORT_FIELDS = [
  "createdAt",
  "paidAt",
  "status",
  "totalAmount",
  "totalItems",
] as const;
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

    const showB2B = url.searchParams.get("showB2B") !== "false";
    const showRegular = url.searchParams.get("showRegular") !== "false";
    const search = url.searchParams.get("search")?.trim() || undefined;

    const conditions: Prisma.OrderWhereInput[] = [];
    if (!showB2B && !showRegular) {
      return { data: [], total: 0, page, totalPages: 0 };
    } else if (showB2B && !showRegular) {
      conditions.push({ isB2BManual: true });
    } else if (!showB2B && showRegular) {
      conditions.push({ isB2BManual: false });
    }

    if (search) {
      conditions.push({
        OR: [
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { firstName: { contains: search, mode: "insensitive" } } },
          { user: { lastName: { contains: search, mode: "insensitive" } } },
          { id: { startsWith: search } },
        ],
      });
    }

    const where: Prisma.OrderWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: ORDER_LIST_SELECT,
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  { auth: "admin" }
);
