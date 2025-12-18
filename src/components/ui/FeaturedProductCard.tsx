"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatPLN } from "@/lib/formatter";
import { ShoppingBag, Star } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  priceInCents: number;
  imagePath: string;
  description: string;
};

interface FeaturedProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export function FeaturedProductCard({ product, onAddToCart }: FeaturedProductCardProps) {
  return (
    <Link href={`/sklep/${product.id}`} className="block group">
      <Card className="w-full overflow-hidden shadow-md relative transition-shadow hover:shadow-lg">
        {/* Featured badge */}
        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs flex items-center gap-1">
          <Star className="size-3 fill-current" />
          <span>Polecane</span>
        </div>

        {/* Product image */}
        <div className="w-full h-44 relative overflow-hidden">
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-500"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        {/* Product content */}
        <div className="p-4">
          <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mt-4">
            <div className="text-primary font-semibold">{formatPLN(product.priceInCents)}</div>

            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart?.();
              }}
              className="flex items-center gap-1 relative z-10"
            >
              <ShoppingBag className="size-4" />
              <span>Dodaj</span>
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
