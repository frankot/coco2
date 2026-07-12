import { NextRequest } from "next/server";
import prisma from "@/db";
import { createRouteHandler, ApiError, getRequiredParam, readJson } from "@/lib/api";
import { ORDER_DETAIL_INCLUDE } from "@/lib/selects";
import { confirmOrderInApaczka } from "@/lib/apaczka-confirm";
import { Apaczka } from "@/lib/apaczka";
import { sendOrderShippedEmail } from "@/lib/order-emails";
import { z } from "zod";

const ORDER_STATUSES = [
  "PENDING",
  "PREORDER",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

// Valid status transitions: from -> allowed destinations
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "PROCESSING", "SHIPPED", "CANCELLED"],
  PREORDER: ["PROCESSING", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const patchOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentMethod: z.enum(["BANK_TRANSFER", "COD", "STRIPE", "INVOICE_DEFERRED"]).optional(),
});

// Resolve shipping service name from Apaczka service structure when missing
async function resolveShippingServiceName(serviceId: string): Promise<string | null> {
  try {
    const svc = await Apaczka.serviceStructure();
    const services = (svc as any).response?.services || [];
    const match = services.find(
      (s: any) => String(s.service_id) === String(serviceId)
    );
    return match?.name || null;
  } catch (e) {
    console.warn("Failed to resolve shipping service name for ID", serviceId, e);
    return null;
  }
}

export const GET = createRouteHandler(
  async ({ params }) => {
    const orderId = getRequiredParam(params as any, "id");
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_DETAIL_INCLUDE,
    });
    if (!order) throw new ApiError("Order not found", 404);

    // If shippingServiceName is missing but we have an ID, resolve it from Apaczka
    if (!order.shippingServiceName && order.shippingServiceId) {
      const resolved = await resolveShippingServiceName(order.shippingServiceId);
      if (resolved) {
        // Persist back to DB so future loads skip the API call
        await prisma.order.update({
          where: { id: orderId },
          data: { shippingServiceName: resolved },
        });
        order.shippingServiceName = resolved;
      }
    }

    return order;
  },
  { auth: "admin" }
);

export const PATCH = createRouteHandler(
  async ({ req, params }) => {
    const orderId = getRequiredParam(params as any, "id");
    const body = patchOrderSchema.parse(await readJson(req));
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
        throw new ApiError(`Nie można zmienić statusu z ${currentStatus} na ${body.status}`, 400);
      }

      previousStatus = currentStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: body.status,
        paymentMethod: body.paymentMethod,
        ...(body.status === "PAID" ||
        (previousStatus === "PENDING" &&
          (body.status === "PROCESSING" || body.status === "SHIPPED"))
          ? { paidAt: new Date() }
          : {}),
      },
      include: ORDER_DETAIL_INCLUDE,
    });

    const movedToProcessing = previousStatus !== "PROCESSING" && body.status === "PROCESSING";

    if (movedToProcessing && updatedOrder.isB2BManual) {
      return { ...updatedOrder, apaczkaSkippedReason: "B2B_MANUAL" };
    }

    if (movedToProcessing && !updatedOrder.apaczkaOrderId) {
      try {
        await confirmOrderInApaczka(orderId);
        // Re-fetch to include Apaczka data in response
        const refreshed = await prisma.order.findUnique({
          where: { id: orderId },
          include: ORDER_DETAIL_INCLUDE,
        });
        if (refreshed) return refreshed;
      } catch (error: any) {
        console.error("[APACZKA] Order confirmation failed", { orderId, error });
        if (previousStatus) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: previousStatus,
              ...(previousStatus === "PENDING" ? { paidAt: null } : {}),
            },
          });
        }
        throw new ApiError(
          `Nie udało się utworzyć przesyłki Apaczka: ${error?.message || "nieznany błąd"}`,
          502
        );
      }
    }

    const movedToShipped = previousStatus !== "SHIPPED" && body.status === "SHIPPED";

    if (movedToShipped) {
      sendOrderShippedEmail({
        id: updatedOrder.id,
        paymentMethod: updatedOrder.paymentMethod,
        pricePaidInCents: updatedOrder.pricePaidInCents,
        subtotalInCents: updatedOrder.subtotalInCents,
        shippingCostInCents: updatedOrder.shippingCostInCents,
        discountAmountInCents: updatedOrder.discountAmountInCents,
        apaczkaTrackingUrl: updatedOrder.apaczkaTrackingUrl,
        apaczkaWaybillNumber: updatedOrder.apaczkaWaybillNumber,
        shippingServiceName: updatedOrder.shippingServiceName,
        isB2BManual: updatedOrder.isB2BManual,
        user: updatedOrder.user,
        orderItems: updatedOrder.orderItems,
      }).catch((error) => {
        console.error("[EMAIL] Failed to send shipped email", { orderId, error });
      });
    }

    // Cancellation side effects
    const movedToCancelled = previousStatus !== "CANCELLED" && body.status === "CANCELLED";

    if (movedToCancelled) {
      if (updatedOrder.apaczkaOrderId) {
        Apaczka.cancelOrder(updatedOrder.apaczkaOrderId).catch((error) => {
          console.error("[APACZKA] Order cancellation failed", { orderId, error });
        });
      }

      // TODO: generate correction invoice (faktura korygująca) when wfirmaInvoiceId exists
    }

    // Resolve shipping service name if still missing
    if (!updatedOrder.shippingServiceName && updatedOrder.shippingServiceId) {
      const resolved = await resolveShippingServiceName(updatedOrder.shippingServiceId);
      if (resolved) {
        await prisma.order.update({
          where: { id: orderId },
          data: { shippingServiceName: resolved },
        });
        updatedOrder.shippingServiceName = resolved;
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
