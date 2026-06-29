// Delete all CANCELLED orders for frankiantki@gmail.com
// Cascades to OrderItem and Payment. Other data untouched.

import "dotenv/config";
import { PrismaClient } from "../src/app/generated/prisma/client";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });
const EMAIL = "frankiantki@gmail.com";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) {
    console.log(`User ${EMAIL} not found. Nothing to do.`);
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id, status: "CANCELLED" },
    select: { id: true, createdAt: true, pricePaidInCents: true },
  });

  if (orders.length === 0) {
    console.log(`No CANCELLED orders for ${EMAIL}. Nothing to do.`);
    return;
  }

  console.log(`Deleting ${orders.length} CANCELLED orders for ${EMAIL}:`);
  for (const o of orders) {
    console.log(`  ${o.id} — ${(o.pricePaidInCents / 100).toFixed(2)} zł (${o.createdAt.toISOString().slice(0, 10)})`);
  }

  const result = await prisma.order.deleteMany({
    where: { userId: user.id, status: "CANCELLED" },
  });

  console.log(`\nDeleted ${result.count} order(s) successfully.`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
