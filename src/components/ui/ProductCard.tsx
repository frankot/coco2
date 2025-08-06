"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPLN } from "@/lib/formatter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/app/(customFacing)/components/Cart";
import type { Product } from "@/app/(customFacing)/components/Cart";

type ProductCardProps = {
  product: Product;
};

// Skeleton loader component
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

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product.isAvailable) return;
    setIsAddingToCart(true);
    await addToCart(product, 1);
    setIsAddingToCart(false);
  };

  return (
    <div className="rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group ">
      {/* Image container with centered badge */}
      <div className="relative">
        <div className="w-full h-80 relative overflow-visible">
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        {/* Centered badge */}
        <div className="absolute top-4 right-12 transform -translate-x-1/2 bg-primary text-white px-3 py-2 rounded-lg text-base font-semibold shadow-lg">
          12x
        </div>
      </div>

      {/* Product info */}
      <div className="p-6 space-y-4">
        {/* Product name */}
        <Link href={`/sklep/${product.id}`} className="block group">
          <h3 className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2 text-center">
            {product.name}
          </h3>
          <p className="text-sm font-bold text-primary text-center mt-1">(zestaw 12 sztuk)</p>
        </Link>

        {/* Centered price */}
        <div className="text-center space-y-2">
          <div className="text-xl font-bold text-black">{formatPLN(product.priceInCents)}</div>
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {formatPLN(Math.round(product.priceInCents / 12))} / za szt. w zest.
          </div>
        </div>

        {/* Centered add to cart button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-fit text-white hover:bg-primary hover:text-white/70 font-medium"
            disabled={!product.isAvailable || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <>
                <Check className="mr-2 h-4 w-4 " />
                Dodano
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Do koszyka
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
