import prisma from "@/db";
import FeaturedProduct from "../../../components/ui/ProductCard";

// Array of background colors to alternate between
const BACKGROUND_COLORS = ["#f0f9ff", "#fffbeb"];

async function getLatestProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      id: "desc", // Assuming newer products have higher IDs, adjust if needed
    },
    take: 2,
  });

  return products;
}

export default async function FeaturedProducts() {
  const products = await getLatestProducts();

  if (products.length === 0) {
    return null; // Don't render anything if no products are available
  }

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
    

        <div className="">
          {products.map((product, index) => (
            <FeaturedProduct
              key={product.id}
              product={product}
              backgroundColor={BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]}
              imageOnLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
