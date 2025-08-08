import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";
import { ORDER_LIST_SELECT } from "@/lib/selects";

export const GET = createRouteHandler(
  async () => {
    return prisma.order.findMany({
      select: ORDER_LIST_SELECT,
      orderBy: { createdAt: "desc" },
    });
  },
  { auth: "admin" }
);
