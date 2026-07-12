import Image from "next/image";
import Link from "next/link";
import { Bell, Check, ShoppingBag, Star } from "lucide-react";
import { formatPLN } from "@/lib/formatter";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { DeferredHoverImage } from "@/components/ui/deferred-hover-image";
import type { Product } from "@/app/generated/prisma/client";

const productCardImageSizes =
  "(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 56px) / 2), (max-width: 1279px) calc((100vw - 80px) / 3), 288px";

export function ProductCard({ product, preload }: { product: Product; preload?: boolean }) {
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
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      {product.promo && (
        <div className="bg-primary text-primary-foreground text-center text-xs font-semibold uppercase tracking-wide py-1.5">
          Promocja
        </div>
      )}

      <div className="relative aspect-square overflow-hidden">
        <Link href={`/sklep/${product.slug || product.id}`}>
          {mainImage && (
            <div className="relative w-full h-full">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                preload={preload}
                sizes={productCardImageSizes}
                className="object-contain group-hover:scale-105 transition-all duration-300"
              />
              {hasMultipleImages && hoverImage && (
                <DeferredHoverImage
                  src={hoverImage}
                  alt={`${product.name} - second view`}
                  sizes={productCardImageSizes}
                  className="object-contain group-hover:scale-105 transition-all duration-300 absolute inset-0"
                />
              )}
            </div>
          )}
        </Link>

        {product.isPreorder ? (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            PREORDER
          </div>
        ) : !product.isAvailable ? (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Niedostępny
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <Link href={`/sklep/${product.slug || product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            {product.isPreorder && product.preorderOriginalPriceInCents && (
              <div className="text-sm text-gray-400 line-through">
                {formatPLN(product.preorderOriginalPriceInCents)}
              </div>
            )}
            <div className="text-xl font-bold text-primary">{formatPLN(product.priceInCents)}</div>
            {product.itemsPerPack > 1 && (
              <div className="text-xs text-gray-500 mt-0.5">
                {product.itemsPerPack} szt. &middot;{" "}
                {formatPLN(Math.round(product.priceInCents / product.itemsPerPack))}/szt.
              </div>
            )}
            {preorderDiscount > 0 && (
              <div className="text-xs font-semibold text-amber-700 mt-0.5">-{preorderDiscount}% preorder</div>
            )}
          </div>

          {product.isPreorder ? (
            <Link
              href={`/sklep/${product.slug || product.id}`}
              className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-500 hover:text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              {isPreorderActive ? "Preorder" : "Zakończony"}
            </Link>
          ) : product.isAvailable ? (
            <AddToCartButton
              product={cartProduct}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              idleContent={
                <>
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Dodaj
                </>
              }
              loadingContent={
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Dodawanie...
                </>
              }
            />
          ) : (
            <Link
              href={`/sklep/${product.slug || product.id}`}
              className="inline-flex items-center rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-transparent hover:text-primary"
            >
              <Bell className="w-4 h-4 mr-1" />
              Powiadom
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
