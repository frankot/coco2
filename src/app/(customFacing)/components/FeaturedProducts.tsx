import prisma from "@/db";
import ProductCard from "../../../components/ui/ProductCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";

async function getLatestProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const session = await getServerSession(authOptions);
  return resolveProductPrices(products, session?.user?.id);
}

export default async function FeaturedProducts() {
  const products = await getLatestProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 ">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="featured-product-item"
              style={{ "--stagger-delay": `${index * 120}ms` } as React.CSSProperties}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
