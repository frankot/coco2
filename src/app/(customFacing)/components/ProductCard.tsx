"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPLN } from "@/lib/formatter";
import { useCart } from "@/app/(customFacing)/components/Cart";
import { toast } from "sonner";
import type { Product } from "@/app/(customFacing)/components/Cart";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product.isAvailable) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Usunięto z ulubionych" : "Dodano do ulubionych");
  };

  // Images
  const mainImage = product.imagePaths[0] || "";
  const hoverImage = product.imagePaths[1] || mainImage;
  const hasMultipleImages = product.imagePaths.length > 1;

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/sklep/${product.slug || product.id}`}>
          {mainImage && (
            <div className="relative w-full h-full">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`object-contain group-hover:scale-105 transition-all duration-300 ${
                  hasMultipleImages && isHovered ? "opacity-0" : "opacity-100"
                }`}
              />
              {hasMultipleImages && hoverImage && (
                <Image
                  src={hoverImage}
                  alt={`${product.name} - second view`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className={`object-contain group-hover:scale-105 transition-all duration-300 absolute inset-0 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </div>
          )}
        </Link>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>

        {/* Availability Badge */}
        {!product.isAvailable && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Niedostępny
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/sklep/${product.slug || product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-primary">{formatPLN(product.priceInCents)}</div>
            {product.itemsPerPack > 1 && (
              <div className="text-xs text-gray-500 mt-0.5">
                {product.itemsPerPack} szt. &middot;{" "}
                {formatPLN(Math.round(product.priceInCents / product.itemsPerPack))}/szt.
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || isAddingToCart}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            {isAddingToCart ? "Dodawanie..." : "Dodaj"}
          </Button>
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
