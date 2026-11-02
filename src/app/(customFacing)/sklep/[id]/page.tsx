import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import { getProductByIdOrSlug, getVisibleProduct } from "@/lib/products-public";
import { getProductMetaDescription, getProductMetaTitle } from "@/lib/product-seo";
import { buildProductJsonLd, serializeJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdOrSlug(id);

  if (!product) {
    return {
      title: "Produkt nie znaleziony",
      description: "Szukany produkt nie istnieje w sklepie Dr.Coco.",
    };
  }

  const title = getProductMetaTitle(product);
  const description = getProductMetaDescription(product);

  const ogImage = product.imagePaths?.[0] || "/og-image.webp";

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `https://drcoco.pl/sklep/${product.slug || id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://drcoco.pl/sklep/${product.slug || id}`,
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
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getVisibleProduct(id);
  if (!product) notFound();

  // Base (guest) product for structured data
  const baseProduct = (await getProductByIdOrSlug(id)) ?? product;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildProductJsonLd(baseProduct)) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
