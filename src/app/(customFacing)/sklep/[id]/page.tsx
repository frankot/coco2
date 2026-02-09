import type { Metadata } from "next";
import prisma from "@/db";
import ProductPageClient from "./ProductPageClient";
import { formatPLN } from "@/lib/formatter";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return {
      title: "Produkt nie znaleziony",
      description: "Szukany produkt nie istnieje w sklepie Dr.Coco.",
    };
  }

  const description = product.description
    ? product.description.slice(0, 160) + (product.description.length > 160 ? "..." : "")
    : `${product.name} - naturalna woda kokosowa Dr.Coco®. Zamów online z dostawą w całej Polsce.`;

  const price = formatPLN(product.priceInCents);
  const ogImage = product.imagePaths?.[0] || "/og-image.webp";

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `https://drcoco.pl/sklep/${id}`,
    },
    openGraph: {
      title: `${product.name} | Dr.Coco`,
      description,
      url: `https://drcoco.pl/sklep/${id}`,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Dr.Coco`,
      description,
      images: [ogImage],
    },
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductPageClient params={params} />;
}
