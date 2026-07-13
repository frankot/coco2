import { PrismaClient } from "../src/app/generated/prisma/client";

async function main() {
  const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });
  console.log(typeof (prisma as any).product, typeof (prisma as any).$queryRaw);
  const products = await (prisma as any).product.findMany({ take: 1 });
  console.log(products.length);
  await (prisma as any).$disconnect?.();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
