import prisma from "../src/db";

async function main() {
  console.log("Cleaning test data...");

  // 1. Nullify discountCodeId on orders (no cascade from DiscountCode)
  await prisma.order.updateMany({
    where: { discountCodeId: { not: null } },
    data: { discountCodeId: null },
  });
  console.log("  ✓ Discount code references nullified on orders");

  // 2. Delete all discount codes
  const deletedCodes = await prisma.discountCode.deleteMany();
  console.log(`  ✓ Deleted ${deletedCodes.count} discount codes`);

  // 3. Delete all users → cascades to orders → orderItems, payments, addresses, customPrices, passwordResetTokens
  const deletedUsers = await prisma.user.deleteMany();
  console.log(`  ✓ Deleted ${deletedUsers.count} users (orders, addresses, payments cascaded)`);

  console.log("\nDone. Products and blog posts untouched.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
