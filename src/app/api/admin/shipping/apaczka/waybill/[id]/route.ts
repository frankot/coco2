import { NextResponse } from "next/server";
import { createRouteHandler, ApiError, getRequiredParam } from "@/lib/api";
import prisma from "@/db";
import Apaczka from "@/lib/apaczka";

export const GET = createRouteHandler(async ({ params }) => {
  const id = getRequiredParam(params as any, "id"); // local order id
  const order = await prisma.order.findUnique({
    where: { id },
    select: { apaczkaOrderId: true, apaczkaWaybillNumber: true },
  });
  if (!order) throw new ApiError("Order not found", 404);
  if (!order.apaczkaOrderId) throw new ApiError("Order is not confirmed in Apaczka", 400);

  const res = await Apaczka.waybill(order.apaczkaOrderId);
  const base64 = res.response.waybill;
  const buf = Buffer.from(base64, "base64");
  const filename = `Etykieta_${order.apaczkaWaybillNumber || order.apaczkaOrderId}.pdf`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}, { auth: "admin" });
