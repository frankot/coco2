import prisma from "@/db";
import wFirma from "@/lib/wfirma";

function formatPriceFromCents(cents: number) {
  return (cents / 100).toFixed(2);
}

function buildContractorName(order: {
  user: { firstName: string | null; lastName: string | null; email: string };
}) {
  const fullName = [order.user.firstName, order.user.lastName].filter(Boolean).join(" ").trim();
  return fullName || order.user.email;
}

export async function generateAndSendInvoice(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      billingAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (order.wfirmaInvoiceId) {
    return;
  }

  const lines = order.orderItems.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: formatPriceFromCents(item.pricePerItemInCents),
    vat: "23",
  }));

  if (order.shippingCostInCents > 0) {
    lines.push({
      name: "Dostawa",
      quantity: 1,
      price: formatPriceFromCents(order.shippingCostInCents),
      vat: "23",
    });
  }

  const createResponse = await wFirma.createInvoice({
    contractor: {
      name: buildContractorName(order),
      street: order.billingAddress.street,
      zip: order.billingAddress.postalCode,
      city: order.billingAddress.city,
      country: order.billingAddress.country,
      email: order.user.email,
      phone: order.billingAddress.phoneNumber,
    },
    paymentMethod: order.paymentMethod === "COD" ? "cod" : "transfer",
    paymentState: order.paymentMethod === "COD" ? "unpaid" : "paid",
    lines,
  });

  const invoiceMeta = wFirma.extractInvoiceMeta(createResponse);
  const invoiceId = invoiceMeta?.id ?? null;
  const invoiceNumber = invoiceMeta?.number ?? null;

  if (!invoiceId) {
    console.error("[WFIRMA] Unexpected createInvoice response", {
      orderId,
      response: JSON.stringify(createResponse).slice(0, 4000),
    });
    throw new Error(`wFirma did not return an invoice ID for order ${orderId}`);
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        wfirmaInvoiceId: invoiceId,
        wfirmaInvoiceNumber: invoiceNumber,
      },
    });
  } catch (error) {
    console.error("[WFIRMA] Failed to persist invoice metadata", { orderId, invoiceId, error });
    throw error;
  }

  try {
    await wFirma.sendInvoice(
      invoiceId,
      order.user.email,
      `Faktura do zamówienia ${orderId}`,
      "W załączniku przesyłamy fakturę."
    );
  } catch (error) {
    console.error("[WFIRMA] Failed to send invoice email", { orderId, invoiceId, error });
    return;
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        wfirmaInvoiceSentAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[WFIRMA] Failed to persist sent timestamp", { orderId, invoiceId, error });
  }
}
