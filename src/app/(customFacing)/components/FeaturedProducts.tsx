import prisma from "@/db";
import ProductCard from "../../../components/ui/ProductCard";

async function getSecondProduct() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 2,
  });

  // Return the second product (index 1) or the first if only one exists
  return products[1] || products[0];
}

export default async function FeaturedProducts() {
  const product = await getSecondProduct();

  if (!product) {
    return null;
  }

  // Create an array with the same product repeated 4 times
  const products = Array(4).fill(product);

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
