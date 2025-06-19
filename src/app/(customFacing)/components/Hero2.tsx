import prisma from "@/db";
import { Hero2Client } from "./Hero2Client";

async function getLatestProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 2,
  });

  return products;
}

export async function Hero2() {
  const products = await getLatestProducts();
  return <Hero2Client products={products} />;
}
