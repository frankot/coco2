import type { Product } from "@/app/generated/prisma/client";

const SITE_URL = "https://drcoco.pl";

function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function availabilityOf(product: Product) {
  if (product.isPreorder) {
    const startsAt = product.preorderAvailableAt;
    return startsAt && startsAt.getTime() > Date.now()
      ? { availability: "https://schema.org/PreOrder", availabilityStarts: startsAt.toISOString() }
      : { availability: "https://schema.org/OutOfStock" };
  }
  return {
    availability: product.isAvailable
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
  };
}

// Product + Offer JSON-LD (base guest price)
export function buildProductJsonLd(product: Product) {
  const url = `${SITE_URL}/sklep/${product.slug || product.id}`;
  const images = product.imagePaths.filter(Boolean).map(absoluteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.length > 0 ? images : [`${SITE_URL}/og-image.webp`],
    url,
    sku: product.id,
    mpn: product.id,
    productID: product.id,
    brand: { "@type": "Brand", name: "Dr.Coco" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PLN",
      price: (product.priceInCents / 100).toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      ...availabilityOf(product),
      seller: { "@type": "Organization", name: "NEW AGE FOOD sp. z o.o." },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PL",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        merchantReturnLink: `${SITE_URL}/zwroty`,
      },
    },
  };
}

// Safe JSON for inline script
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
