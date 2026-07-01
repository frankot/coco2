import prisma from "@/db";
import wFirma, { type CorrectionInvoiceLineItem } from "@/lib/wfirma";

// In-flight generation lock
const generating = new Set<string>();

function formatPriceFromCents(cents: number) {
  return (cents / 100).toFixed(2);
}

function buildContractorName(order: {
  user: { firstName: string | null; lastName: string | null; email: string };
  wantsFaktura: boolean;
  companyName: string | null;
}) {
  if (order.wantsFaktura && order.companyName) return order.companyName;
  const fullName = [order.user.firstName, order.user.lastName].filter(Boolean).join(" ").trim();
  return fullName || order.user.email;
}

function parseAmountInCents(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(String(value).replace(",", "."));
  if (!Number.isFinite(amount)) return null;
  return Math.round(amount * 100);
}

function getNumericRecordValues(value: unknown) {
  if (!value || typeof value !== "object") return [];
  return Object.values(value as Record<string, unknown>);
}

function extractWfirmaInvoice(data: unknown) {
  const any = data as any;
  const invoices = any?.response?.invoices ?? any?.invoices;
  const first = invoices?.["0"] ?? invoices?.[0] ?? invoices?.invoice ?? getNumericRecordValues(invoices)[0];
  const invoice = first?.invoice ?? first;
  const invoicecontents = invoice?.invoicecontents;
  const contents = getNumericRecordValues(invoicecontents)
    .map((val: any) => val?.invoicecontent ?? val)
    .filter(Boolean)
    .map((item: any) => ({
      name: item?.name != null ? String(item.name) : null,
      count: item?.count != null ? Number(String(item.count).replace(",", ".")) : null,
    }));

  return {
    totalInCents: parseAmountInCents(invoice?.total ?? invoice?.total_composed ?? invoice?.brutto),
    contents,
  };
}

function verifyCreatedInvoice(params: {
  orderId: string;
  invoiceId: string;
  totalInCents: number;
  lines: Array<{ name: string; quantity: number }>;
  invoiceData: unknown;
}) {
  const invoice = extractWfirmaInvoice(params.invoiceData);
  const errors: string[] = [];

  if (invoice.totalInCents !== null && invoice.totalInCents !== params.totalInCents) {
    errors.push(`total ${invoice.totalInCents} != ${params.totalInCents}`);
  }

  params.lines.forEach((line, index) => {
    const remote = invoice.contents[index];
    if (!remote) {
      errors.push(`missing line ${index + 1}: ${line.name}`);
      return;
    }
    if (remote.count === null || Math.abs(remote.count - line.quantity) > 0.0001) {
      errors.push(`count ${remote.name ?? line.name}: ${remote.count} != ${line.quantity}`);
    }
  });

  if (errors.length > 0) {
    console.error("[WFIRMA] Invoice verification failed", {
      orderId: params.orderId,
      invoiceId: params.invoiceId,
      errors,
    });
    return false;
  }

  return true;
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
    // wantsFaktura, companyName, nip are scalar fields included automatically
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  // Never invoice an order that hasn't been confirmed paid.
  const paidStatuses: typeof order.status[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
  if (!paidStatuses.includes(order.status)) {
    return;
  }

  if (order.isB2BManual) {
    return;
  }

  if (order.wfirmaInvoiceId) {
    return;
  }

  if (generating.has(orderId)) {
    return;
  }
  generating.add(orderId);

  try {
    const lines = order.orderItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: formatPriceFromCents(item.pricePerItemInCents),
      vat: "23",
    }));

    // Discount line (rabat) — negative gross amount matching the discount applied at checkout
    if (order.discountAmountInCents > 0) {
      const discountLabel = order.discountCodeValue
        ? `Rabat (${order.discountCodeValue})`
        : "Rabat";
      lines.push({
        name: discountLabel,
        quantity: 1,
        price: `-${formatPriceFromCents(order.discountAmountInCents)}`,
        vat: "23",
      });
    }

    if (order.shippingCostInCents > 0) {
      lines.push({
        name: "Dostawa",
        quantity: 1,
        price: formatPriceFromCents(order.shippingCostInCents),
        vat: "23",
      });
    }

    const productTotalInCents = order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.pricePerItemInCents,
      0
    );
    const expectedTotalInCents =
      productTotalInCents - order.discountAmountInCents + order.shippingCostInCents;

    if (expectedTotalInCents !== order.pricePaidInCents) {
      console.error("[WFIRMA] Invoice total preflight failed", {
        orderId,
        expectedTotalInCents,
        pricePaidInCents: order.pricePaidInCents,
      });
      throw new Error(`Invoice total mismatch for order ${orderId}`);
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
        nip: order.wantsFaktura ? order.nip : null,
      },
      paymentMethod: order.paymentMethod === "COD" ? "cod" : "transfer",
      paymentState: order.paymentMethod === "COD" ? "unpaid" : "paid",
      totalGross: formatPriceFromCents(order.pricePaidInCents),
      lines,
      seriesId: process.env.WFIRMA_ECOMMERCE_SERIES_ID,
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

    let invoiceVerified = false;
    try {
      const invoiceData = await wFirma.getInvoice(invoiceId);
      invoiceVerified = verifyCreatedInvoice({
        orderId,
        invoiceId,
        totalInCents: order.pricePaidInCents,
        lines,
        invoiceData,
      });
    } catch (error) {
      console.error("[WFIRMA] Invoice verification request failed", { orderId, invoiceId, error });
      return;
    }

    if (!invoiceVerified) {
      return;
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
  } finally {
    generating.delete(orderId);
  }
}

// Extract invoicecontent items from wFirma getInvoice response
// Extract invoicecontent items from wFirma getInvoice response
// Response uses numeric-string keys: { "0": { invoicecontent: { id, name } }, "1": { ... } }
function extractInvoiceContents(data: unknown): Array<{ id: string; name: string }> {
  const any = data as any;

  // Navigate envelope: invoices."0".invoice.invoicecontents
  const invoicesObj = any?.invoices;
  const firstEntry = invoicesObj?.["0"] ?? invoicesObj?.[0];
  const invoice = firstEntry?.invoice;
  const invoicecontents = invoice?.invoicecontents;

  if (!invoicecontents || typeof invoicecontents !== "object") return [];

  const contents: Array<{ id: string; name: string }> = [];

  for (const val of Object.values(invoicecontents)) {
    const item = (val as any)?.invoicecontent ?? val;
    if (item?.id && item?.name) {
      contents.push({ id: String(item.id), name: String(item.name) });
    }
  }

  return contents;
}

export async function generateCorrectionInvoice(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      wfirmaInvoiceId: true,
      wfirmaCorrectionInvoiceId: true,
    },
  });

  if (!order) throw new Error(`Order ${orderId} not found`);
  if (!order.wfirmaInvoiceId) return;
  if (order.wfirmaCorrectionInvoiceId) return;

  // Fetch original invoice to get line item IDs
  const invoiceData = await wFirma.getInvoice(order.wfirmaInvoiceId);
  const contents = extractInvoiceContents(invoiceData);

  if (contents.length === 0) {
    console.error("[WFIRMA] getInvoice response for parsing", {
      orderId,
      invoiceId: order.wfirmaInvoiceId,
      response: JSON.stringify(invoiceData).slice(0, 4000),
    });
    throw new Error(
      `No invoicecontent items found for wFirma invoice ${order.wfirmaInvoiceId}`
    );
  }

  const lineItems: CorrectionInvoiceLineItem[] = contents.map((c) => ({
    parentId: c.id,
    name: c.name,
  }));

  const correctionResponse = await wFirma.createCorrectionInvoice(
    order.wfirmaInvoiceId,
    lineItems
  );

  const correctionMeta = wFirma.extractInvoiceMeta(correctionResponse);
  const correctionId = correctionMeta?.id ?? null;
  const correctionNumber = correctionMeta?.number ?? null;

  if (!correctionId) {
    console.error("[WFIRMA] Unexpected correction invoice response", {
      orderId,
      response: JSON.stringify(correctionResponse).slice(0, 4000),
    });
    throw new Error(`wFirma did not return a correction invoice ID for order ${orderId}`);
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      wfirmaCorrectionInvoiceId: correctionId,
      wfirmaCorrectionInvoiceNumber: correctionNumber,
    },
  });
}
