import prisma from "@/db";
import { Hero2 } from "./Hero2";

async function getLatestProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
  });

  return products;
}

export default async function LatestProductsSection() {
  const products = await getLatestProducts();

  if (!products.length) {
    return null;
  }

  return <Hero2 latestProducts={products} />;
}
