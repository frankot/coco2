import { createRouteHandler, ApiError, getRequiredParam } from "@/lib/api";
import prisma from "@/db";
import { generateAndSendInvoice } from "@/lib/invoice";

export const POST = createRouteHandler(
  async ({ params }) => {
    const id = getRequiredParam(params as any, "id");
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!order) throw new ApiError("Order not found", 404);

    await prisma.order.update({
      where: { id },
      data: {
        wfirmaInvoiceId: null,
        wfirmaInvoiceNumber: null,
        wfirmaInvoiceSentAt: null,
      },
    });

    await generateAndSendInvoice(id);

    return { success: true };
  },
  { auth: "admin" }
);
