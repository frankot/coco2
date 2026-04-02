import { NextRequest } from "next/server";
import prisma from "@/db";
import { createRouteHandler, ApiError, getRequiredParam, readJson } from "@/lib/api";
import { ORDER_DETAIL_INCLUDE } from "@/lib/selects";
import { generateAndSendInvoice } from "@/lib/invoice";
import { confirmOrderInApaczka } from "@/lib/apaczka-confirm";
import { z } from "zod";

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

// Valid status transitions: from -> allowed destinations
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
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
    let previousPaymentMethod: "BANK_TRANSFER" | "COD" | "STRIPE" | null = null;
    let previousStatus: OrderStatus | null = null;

    // Validate status transition if status is being changed
    if (body.status) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true, paymentMethod: true },
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

      previousStatus = currentStatus;
      previousPaymentMethod = order.paymentMethod;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: body.status, paymentMethod: body.paymentMethod },
      include: ORDER_DETAIL_INCLUDE,
    });

    const effectivePaymentMethod =
      (body.paymentMethod as "BANK_TRANSFER" | "COD" | "STRIPE" | undefined) ?? previousPaymentMethod;
    const movedToProcessing = previousStatus !== "PROCESSING" && body.status === "PROCESSING";

    if (movedToProcessing) {
      // Send to Apaczka when moving to PROCESSING (if not already sent)
      if (!updatedOrder.apaczkaOrderId) {
        confirmOrderInApaczka(orderId).catch((error) => {
          console.error("[APACZKA] Order confirmation failed", { orderId, error });
        });
      }

      // Generate invoice for COD orders
      if (effectivePaymentMethod === "COD") {
        generateAndSendInvoice(orderId).catch((error) => {
          console.error("[WFIRMA] Invoice generation failed after moving COD order to processing", {
            orderId,
            error,
          });
        });
      }
    }

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
