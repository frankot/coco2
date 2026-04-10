import prisma from "@/db";
import ProductCard from "../../../components/ui/ProductCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveProductPrices } from "@/lib/resolve-prices";

async function getLatestProducts() {
  const session = await getServerSession(authOptions);
  const accountType = session?.user?.accountType;

  // Visibility filter (guests treated as DETAL)
  const where: any = { isAvailable: true };
  if (!accountType || accountType === "DETAL") where.visibleToDetal = true;
  else if (accountType === "DETAL_B2B") where.visibleToDetalB2B = true;
  else if (accountType === "HURT") where.visibleToHurt = true;

  const products = await prisma.product.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

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
