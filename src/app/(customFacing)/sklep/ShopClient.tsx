"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Product } from "@/app/generated/prisma/client";
import { ProductCard } from "../components/ProductCard";

const featuredSlugs = ["dr-coco-1l", "dr-coco-280ml", "dr-coco-330ml"];

export default function ShopClient({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest");

  const featuredSlugSet = new Set(featuredSlugs);

  // Featured products — also filtered by search
  const featuredProducts = featuredSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product))
    .filter(
      (product) =>
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Other products — filtered by search and sorted
  const otherProducts = products
    .filter((product) => !featuredSlugSet.has(product.slug ?? ""))
    .filter(
      (product) =>
        !searchTerm ||
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

  const visibleProducts = [...featuredProducts, ...otherProducts];
  const showNoResults = searchTerm.length > 0 && visibleProducts.length === 0;

  return (
    <div className="space-y-10">
      {/* Search bar + Sort dropdown */}
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

      {/* No results — only shown when actively searching with no match */}
      {showNoResults && <p className="text-gray-600">Znaleziono 0 produktów</p>}

      {/* Products */}
      {visibleProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} preload={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
