"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPLN } from "@/lib/formatter";
import { useCart } from "@/app/(customFacing)/components/Cart";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  isAvailable: boolean;
  createdAt: string;
};

function Hero3Skeleton() {
  return (
    <section className="relative h-screen max-h-[800px] min-h-[600px] overflow-hidden">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-4/5 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero3() {
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchLatestProduct() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch");
        const products = await response.json();

        if (products.length > 0) {
          setLatestProduct(products[0]); // First product is the latest due to orderBy createdAt desc
        }
      } catch (error) {
        console.error("Error fetching latest product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestProduct();
  }, []);

  const handleAddToCart = async () => {
    if (!latestProduct || !latestProduct.isAvailable) return;

    setIsAddingToCart(true);
    try {
      await addToCart(latestProduct, 1);
      toast.success(`Dodano ${latestProduct.name} do koszyka`);
    } catch (error) {
      toast.error("Nie udało się dodać produktu do koszyka");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <Hero3Skeleton />;
  }

  if (!latestProduct) {
    return null;
  }

  return (
    <section className="relative h-screen max-h-[800px] min-h-[600px] overflow-hidden">
      {/* Background Decorations */}


      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-4 lg:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Najnowszy produkt
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Odkryj nasz
              <span className="text-primary block">{latestProduct.name}</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed line-clamp-3">
              {latestProduct.description}
            </p>

            {/* Rating & Price */}
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-gray-600 ml-2 text-sm lg:text-base">(4.8)</span>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-primary">
                {formatPLN(latestProduct.priceInCents)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!latestProduct.isAvailable || isAddingToCart}
                className="bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl text-base lg:text-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5" />
                {isAddingToCart ? "Dodawanie..." : "Dodaj do koszyka"}
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl text-base lg:text-lg font-semibold transition-all duration-200"
              >
                <Link href={`/sklep/${latestProduct.id}`} className="flex items-center gap-2">
                  Zobacz szczegóły
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Darmowa dostawa
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Naturalne składniki
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Szybka realizacja
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl transform rotate-6"></div>

            {/* Product Image */}
            <div className="relative bg-white w-fit mx-auto rounded-3xl shadow-xl overflow-hidden h-auto">
              <Image
                src={latestProduct.imagePath}
                alt={latestProduct.name}
                width={600}
                height={600}
                className="w-fit h-[600px] object-contain"
                priority
              />

              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <span className="text-primary font-semibold text-sm">NOWOŚĆ</span>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-4 right-1/2 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Ocena 4.8/5</div>
                  <div className="text-xs text-gray-500">Na podstawie 127 opinii</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
