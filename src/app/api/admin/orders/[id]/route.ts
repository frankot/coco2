import { NextRequest } from "next/server";
import prisma from "@/db";
import { createRouteHandler, ApiError, getRequiredParam, readJson } from "@/lib/api";
import { ORDER_DETAIL_INCLUDE } from "@/lib/selects";
import { z } from "zod";

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

// Valid status transitions: from -> allowed destinations
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "PROCESSING", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const patchOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentMethod: z.enum(["BANK_TRANSFER", "COD", "STRIPE"]).optional(),
});

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
    const body = patchOrderSchema.parse(await readJson(req));

    // Validate status transition if status is being changed
    if (body.status) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      });
      if (!order) throw new ApiError("Order not found", 404);

      const currentStatus = order.status as OrderStatus;
      const allowed = VALID_TRANSITIONS[currentStatus];
      if (!allowed.includes(body.status)) {
        throw new ApiError(
          `Nie można zmienić statusu z ${currentStatus} na ${body.status}`,
          400
        );
      }
    }

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
