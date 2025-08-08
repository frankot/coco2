import prisma from "@/db";
import { createRouteHandler, ApiError } from "@/lib/api";

export const GET = createRouteHandler(
  async ({ session }) => {
    if (!session?.user?.email) throw new ApiError("Unauthorized", 401);
    return prisma.order.findMany({
      where: { user: { email: session.user.email } },
      select: {
        id: true,
        pricePaidInCents: true,
        createdAt: true,
        status: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  { auth: "user" }
);
