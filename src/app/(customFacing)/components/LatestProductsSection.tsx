import prisma from "@/db";
import ProductCard from "@/components/ui/ProductCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const latestProductImageSizes =
  "(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 56px) / 2), 384px";

async function getLatestProducts() {
  const session = await getServerSession(authOptions);
  const accountType = session?.user?.accountType;

  const where: any = { isVisible: true };
  if (!accountType || accountType === "DETAL") where.visibleToDetal = true;
  else if (accountType === "DETAL_B2B") {
    where.visibleToDetalB2B = true;
    where.isPreorder = false;
  } else if (accountType === "HURT") {
    where.visibleToHurt = true;
    where.isPreorder = false;
  }

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
            <ProductCard key={product.id} product={product} sizes={latestProductImageSizes} />
          ))}
        </div>
      </div>
    </section>
  );
}
