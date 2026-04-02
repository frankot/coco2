import { NextResponse } from "next/server";
import { createRouteHandler, ApiError, getRequiredParam } from "@/lib/api";
import prisma from "@/db";
import wFirma from "@/lib/wfirma";

export const GET = createRouteHandler(
  async ({ params }) => {
    const id = getRequiredParam(params as any, "id");
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        wfirmaInvoiceId: true,
        wfirmaInvoiceNumber: true,
      },
    });

    if (!order) throw new ApiError("Order not found", 404);
    if (!order.wfirmaInvoiceId) throw new ApiError("Invoice not found for this order", 404);

    const pdf = await wFirma.downloadInvoice(order.wfirmaInvoiceId);
    const filename = `Faktura_${order.wfirmaInvoiceNumber || order.wfirmaInvoiceId}.pdf`;

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  },
  { auth: "admin" }
);
