import prisma from "@/db";
import { createRouteHandler } from "@/lib/api";
import { CLIENT_LIST_SELECT } from "@/lib/selects";

export const GET = createRouteHandler(
  async () => {
    return prisma.user.findMany({
      select: CLIENT_LIST_SELECT,
      orderBy: { createdAt: "desc" },
    });
  },
  { auth: "admin" }
);
