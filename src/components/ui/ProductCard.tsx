import Image from "next/image";
import Link from "next/link";
import { formatPLN } from "@/lib/formatter";
import { Bell, Check, ShoppingBag } from "lucide-react";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { DeferredHoverImage } from "@/components/ui/deferred-hover-image";
import type { Product } from "@/app/generated/prisma/client";

type ProductCardProps = {
  product: Product;
  preload?: boolean;
  sizes?: string;
};

const defaultProductCardImageSizes =
  "(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 56px) / 2), 384px";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse">
      <div className="relative w-full h-80 bg-secondary/20"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-primary/10 rounded w-3/4"></div>
        <div className="h-5 bg-primary/10 rounded w-1/3"></div>
        <div className="h-10 bg-primary/10 rounded w-full"></div>
      </div>
    </div>
  );
}

export default function ProductCard({
  product,
  preload = false,
  sizes = defaultProductCardImageSizes,
}: ProductCardProps) {
  const mainImage = product.imagePaths[0] || "";
  const hoverImage = product.imagePaths[1] || mainImage;
  const hasMultipleImages = product.imagePaths.length > 1;
  const preorderAvailableAt = product.preorderAvailableAt
    ? new Date(product.preorderAvailableAt)
    : null;
  const cartProduct = {
    id: product.id,
    name: product.name,
    priceInCents: product.priceInCents,
    imagePaths: product.imagePaths,
    itemsPerPack: product.itemsPerPack,
    isPreorder: product.isPreorder,
    preorderAvailableAt: preorderAvailableAt?.toISOString(),
  };
  const isPreorderActive =
    product.isPreorder && preorderAvailableAt && preorderAvailableAt.getTime() > Date.now();
  const preorderDiscount =
    product.isPreorder && product.preorderOriginalPriceInCents
      ? Math.max(0, Math.round((1 - product.priceInCents / product.preorderOriginalPriceInCents) * 100))
      : 0;

  return (
    <Link
      href={`/sklep/${product.slug || product.id}`}
      className="rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group block"
    >
      <div className="relative">
        <div className="w-full h-80 relative overflow-visible">
          {product.promo && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white text-center text-xs font-semibold uppercase tracking-wide py-1 px-4 rounded-lg z-10">
              Promocja
            </div>
          )}
          {product.isPreorder && (
            <div className="absolute top-4 left-4 bg-amber-500 text-white text-center text-xs font-semibold uppercase tracking-wide py-1 px-3 rounded-lg z-10">
              PREORDER
            </div>
          )}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-contain p-4 group-hover:scale-105 transition-all duration-300"
            preload={preload}
          />

          {hasMultipleImages && (
            <DeferredHoverImage
              src={hoverImage}
              alt={`${product.name} - alternate view`}
              sizes={sizes}
              className="object-contain p-4 group-hover:scale-105 transition-all duration-300"
            />
          )}
        </div>

        <div className="absolute top-4 right-12 transform -translate-x-1/2 bg-primary text-white px-3 py-2 rounded-lg text-base font-semibold shadow-lg">
          {product.itemsPerPack}x
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2 text-center">
            {product.name}
          </h3>
          <p className="text-sm font-bold text-primary text-center mt-1">
            (zestaw {product.itemsPerPack} sztuk)
          </p>
        </div>

        <div className="text-center space-y-2">
          {product.isPreorder && product.preorderOriginalPriceInCents && (
            <div className="text-sm text-gray-400 line-through">
              {formatPLN(product.preorderOriginalPriceInCents)} / zestaw
            </div>
          )}
          <div className="text-xl font-bold text-black">
            {formatPLN(Math.round(product.priceInCents / product.itemsPerPack))}
          </div>
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {formatPLN(product.priceInCents)} / zestaw
          </div>
          {preorderDiscount > 0 && (
            <div className="text-xs font-semibold text-amber-700">Rabat preorder: -{preorderDiscount}%</div>
          )}
        </div>

        <div className="flex justify-center">
          {product.isPreorder ? (
            <span className="inline-flex items-center rounded-md border border-amber-500 px-4 py-2 text-sm font-medium text-amber-700 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <ShoppingBag className="mr-2 h-4 w-4" />
              {isPreorderActive ? "Zamów w preorderze" : "Preorder zakończony"}
            </span>
          ) : product.isAvailable ? (
            <AddToCartButton
              product={cartProduct}
              size="lg"
              className="w-fit text-white hover:bg-primary hover:text-white/70 font-medium"
              stopLinkNavigation
              idleContent={
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Do koszyka
                </>
              }
              loadingContent={
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Dodano
                </>
              }
            />
          ) : (
            <span className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors group-hover:bg-transparent group-hover:text-primary">
              <Bell className="mr-2 h-4 w-4" />
              Powiadom mnie
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
