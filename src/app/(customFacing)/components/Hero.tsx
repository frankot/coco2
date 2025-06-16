import prisma from "@/db";
import { HeroClient } from "./HeroClient";

// Define Product type
type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  isAvailable: boolean;
};

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

export async function Hero() {
  const products = await getLatestProducts();

  return <HeroClient products={products} />;
}
