// Delete all CANCELLED orders for selected test users.
// Cascades to OrderItem and Payment. Other data untouched.

import "dotenv/config";
import { PrismaClient } from "../src/app/generated/prisma/client";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });
const EMAILS = ["frankiantki@gmail.com", "test@op.pl"];

async function main() {
  let totalDeleted = 0;

  for (const email of EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`User ${email} not found. Nothing to do.`);
      continue;
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id, status: "CANCELLED" },
      select: { id: true, createdAt: true, pricePaidInCents: true },
    });

    if (orders.length === 0) {
      console.log(`No CANCELLED orders for ${email}. Nothing to do.`);
      continue;
    }

    console.log(`Deleting ${orders.length} CANCELLED orders for ${email}:`);
    for (const o of orders) {
      console.log(`  ${o.id} — ${(o.pricePaidInCents / 100).toFixed(2)} zł (${o.createdAt.toISOString().slice(0, 10)})`);
    }

    const result = await prisma.order.deleteMany({
      where: { userId: user.id, status: "CANCELLED" },
    });

    totalDeleted += result.count;
    console.log(`Deleted ${result.count} order(s) for ${email}.\n`);
  }

  console.log(`Deleted ${totalDeleted} order(s) successfully.`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
