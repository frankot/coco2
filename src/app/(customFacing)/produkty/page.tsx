import { Suspense } from "react";
import { PrismaClient } from "@/app/generated/prisma";
import FeaturedProduct, { ProductCardSkeleton } from "@/components/ui/ProductCard";
import Loading from "@/components/ui/loading";

// Loading component to display while data is fetching
function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Loading text="Wczytywanie produktów..." size="sm" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Function to fetch products from database
async function getProducts() {
  const prisma = new PrismaClient();

  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Products listing component
async function ProductsList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Brak produktów</h2>
        <p className="text-muted-foreground">Aktualnie nie mamy żadnych produktów w ofercie.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {products.map((product, index) => (
        <FeaturedProduct
          key={product.id}
          product={product}
          imageOnLeft={index % 2 === 0}
          backgroundColor={
            index % 2 === 0 ? "hsl(var(--primary) / 0.1)" : "hsl(var(--secondary) / 0.1)"
          }
        />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Nasze Produkty</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Odkryj naszą kolekcję wysokiej jakości produktów kokosowych. Wszystkie naturalne,
          organiczne i pełne dobroci.
        </p>
      </div>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}
