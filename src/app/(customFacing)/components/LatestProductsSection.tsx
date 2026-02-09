import prisma from "@/db";
import ProductCard from "@/components/ui/ProductCard";

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
