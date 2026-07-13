import { PrismaClient } from "../src/app/generated/prisma/client";

async function main() {
  const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

  const products = await prisma.product.findMany({
    where: { name: "Preorder test" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { orderItems: true } },
    },
  });

  if (products.length === 0) {
    console.log("No product named Preorder test found.");
    await prisma.$disconnect();
    return;
  }

  for (const product of products) {
    if (product._count.orderItems > 0) {
      console.log(
        `SKIP ${product.name} id=${product.id} slug=${product.slug}: has ${product._count.orderItems} order items`
      );
      continue;
    }

    await prisma.product.delete({ where: { id: product.id } });
    console.log(`DELETED ${product.name} id=${product.id} slug=${product.slug}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
