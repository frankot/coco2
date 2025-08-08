import { NextRequest } from "next/server";
import prisma from "@/db";
import { createRouteHandler, ApiError, getRequiredParam, readJson } from "@/lib/api";
import { ORDER_DETAIL_INCLUDE } from "@/lib/selects";

export const GET = createRouteHandler(
  async ({ params }) => {
    const orderId = getRequiredParam(params as any, "id");
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_DETAIL_INCLUDE,
    });
    if (!order) throw new ApiError("Order not found", 404);
    return order;
  },
  { auth: "admin" }
);

export const PATCH = createRouteHandler(
  async ({ req, params }) => {
    const orderId = getRequiredParam(params as any, "id");
    const body = await readJson<any>(req);
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: body.status, paymentMethod: body.paymentMethod },
      include: { orderItems: true },
    });
    return updatedOrder;
  },
  { auth: "admin" }
);

export const DELETE = createRouteHandler(
  async ({ params }) => {
    const orderId = getRequiredParam(params as any, "id");
    await prisma.order.delete({ where: { id: orderId } });
    return { message: "Order deleted successfully" };
  },
  { auth: "admin" }
);
