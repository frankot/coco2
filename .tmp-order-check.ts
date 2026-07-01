import prisma from './src/db/index.ts';
async function main() {
const order = await prisma.order.findUnique({
  where: { id: '6a4c98c2' },
  select: {
    id: true,
    status: true,
    paymentMethod: true,
    pricePaidInCents: true,
    subtotalInCents: true,
    shippingCostInCents: true,
    discountAmountInCents: true,
    wfirmaInvoiceId: true,
    wfirmaInvoiceNumber: true,
    wfirmaInvoiceSentAt: true,
    orderItems: {
      select: {
        quantity: true,
        pricePerItemInCents: true,
        product: { select: { id: true, name: true } },
      },
    },
  },
});
if (!order) {
  console.log('NOT_FOUND');
} else {
  const productTotal = order.orderItems.reduce((s, i) => s + i.quantity * i.pricePerItemInCents, 0);
  console.log(JSON.stringify({
    id: order.id,
    status: order.status,
    paymentMethod: order.paymentMethod,
    pricePaidInCents: order.pricePaidInCents,
    subtotalInCents: order.subtotalInCents,
    shippingCostInCents: order.shippingCostInCents,
    discountAmountInCents: order.discountAmountInCents,
    calculatedProductTotalInCents: productTotal,
    calculatedGrandTotalInCents: productTotal - order.discountAmountInCents + order.shippingCostInCents,
    wfirmaInvoiceId: order.wfirmaInvoiceId,
    wfirmaInvoiceNumber: order.wfirmaInvoiceNumber,
    wfirmaInvoiceSentAt: order.wfirmaInvoiceSentAt,
    orderItems: order.orderItems.map(i => ({
      productId: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      unitPriceInCents: i.pricePerItemInCents,
      lineTotalInCents: i.quantity * i.pricePerItemInCents,
    })),
  }, null, 2));
}
await prisma.$disconnect();
}
main().catch(async e => { console.log(e.message); await prisma.$disconnect(); process.exit(1); });
