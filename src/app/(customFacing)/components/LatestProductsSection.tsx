import prisma from "@/db";
import ProductCard from "@/components/ui/ProductCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
