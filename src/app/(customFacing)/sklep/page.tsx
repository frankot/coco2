"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Product } from "@/app/(customFacing)/components/Cart";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";

const featuredSlugs = ["dr-coco-1l", "dr-coco-280ml", "dr-coco-330ml"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Nie udało się załadować produktów");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const featuredProducts = featuredSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const featuredSlugSet = new Set(featuredSlugs);

  const filteredAndSortedProducts = products
    .filter((product) => !featuredSlugSet.has(product.slug ?? ""))
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.priceInCents - b.priceInCents;
        case "price-high":
          return b.priceInCents - a.priceInCents;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={`featured-${i}`} />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Szukaj produktów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="newest">Najnowsze</option>
                  <option value="price-low">Cena: od najniższej</option>
                  <option value="price-high">Cena: od najwyższej</option>
                  <option value="name">Nazwa A-Z</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={`product-${i}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Szukaj produktów..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="newest">Najnowsze</option>
                    <option value="price-low">Cena: od najniższej</option>
                    <option value="price-high">Cena: od najwyższej</option>
                    <option value="name">Nazwa A-Z</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-gray-600">
                  {`Znaleziono ${filteredAndSortedProducts.length} produktów`}
                </p>
              </div>

              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Brak produktów</h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? `Nie znaleziono produktów dla "${searchTerm}"`
                      : "Aktualnie nie mamy żadnych produktów w ofercie."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
