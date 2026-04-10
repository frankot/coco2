import prisma from "@/db";
import { HeroClient } from "./HeroClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);
  const accountType = session?.user?.accountType;

  const where: any = { isAvailable: true };
  if (!accountType || accountType === "DETAL") where.visibleToDetal = true;
  else if (accountType === "DETAL_B2B") where.visibleToDetalB2B = true;
  else if (accountType === "HURT") where.visibleToHurt = true;

  const products = await prisma.product.findMany({
    where,
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
