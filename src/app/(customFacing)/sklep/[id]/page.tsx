import { PrismaClient } from "@/app/generated/prisma";
import FeaturedProduct from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Await params before accessing
  const { id: productId } = await params;

  // Fetch product by ID
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  // Return 404 if product not found
  if (!product) {
    notFound();
  }

  return (
    <div className="container py-12">
      <FeaturedProduct
        product={{
          id: product.id,
          name: product.name,
          priceInCents: product.priceInCents,
          description: product.description,
          imagePath: product.imagePath,
          isAvailable: product.isAvailable,
        }}
      />
    </div>
  );
}
