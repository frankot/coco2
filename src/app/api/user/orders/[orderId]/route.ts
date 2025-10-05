import prisma from "@/db";
import { createRouteHandler, ApiError, getRequiredParam } from "@/lib/api";

export const GET = createRouteHandler(
  async ({ session, params }) => {
    if (!session?.user?.email) throw new ApiError("Unauthorized", 401);
    const orderId = getRequiredParam(params as any, "orderId");
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user: { email: session.user.email },
      },
      select: {
        id: true,
        pricePaidInCents: true,
        createdAt: true,
        status: true,
        billingAddress: true,
        shippingAddress: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            pricePerItemInCents: true,
            product: {
              select: {
                id: true,
                name: true,
                priceInCents: true,
              },
            },
          },
        },
      },
    });
    if (!order) throw new ApiError("Order not found", 404);
    return order;
  },
  { auth: "user" }
);
