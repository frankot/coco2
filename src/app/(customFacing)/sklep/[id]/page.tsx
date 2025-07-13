"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Instagram,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrismaClient } from "@/app/generated/prisma";
import { notFound } from "next/navigation";
import { formatPLN } from "@/lib/formatter";
import { useCart } from "@/app/(customFacing)/components/Cart";
import { toast } from "sonner";

// Placeholder data for missing features
const sizes = ["250ml", "500ml", "750ml"];
const colors = [
  { name: "Natural", value: "#8B4513" },
  { name: "Golden", value: "#FFD700" },
  { name: "Amber", value: "#FFBF00" },
];

const relatedProducts = [
  { id: "1", name: "Olej Kokosowy Premium", price: 3999, image: "/logo.png" },
  { id: "2", name: "Masło Kokosowe", price: 2999, image: "/logo.png" },
  { id: "3", name: "Wiórki Kokosowe", price: 1999, image: "/logo.png" },
  { id: "4", name: "Mąka Kokosowa", price: 2499, image: "/logo.png" },
];

const reviews = [
  {
    id: 1,
    name: "Anna Kowalska",
    initials: "AK",
    rating: 5,
    comment: "Fantastyczny produkt! Używam go codziennie do gotowania i pielęgnacji skóry.",
  },
  {
    id: 2,
    name: "Marek Nowak",
    initials: "MN",
    rating: 4,
    comment: "Bardzo dobra jakość, szybka dostawa. Polecam!",
  },
  {
    id: 3,
    name: "Katarzyna Wiśniewska",
    initials: "KW",
    rating: 5,
    comment: "Najlepszy olej kokosowy jaki próbowałam. Naturalny i aromatyczny.",
  },
];

const specifications = [
  { label: "Pojemność", value: "250ml, 500ml, 750ml" },
  { label: "Materiał", value: "Szkło hartowane" },
  { label: "Pochodzenie", value: "Ekologiczne gospodarstwa" },
  { label: "Certyfikaty", value: "BIO, Fair Trade" },
  { label: "Przechowywanie", value: "Suche, chłodne miejsce" },
  { label: "Termin ważności", value: "24 miesiące" },
];

// Product Page Skeleton Component
function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col animate-pulse">
      <main className="flex-grow flex flex-col justify-between py-12">
        <div className="w-[90%] lg:w-[80%] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
            {/* Product Image Skeleton */}
            <div className="lg:w-1/2 order-1 lg:order-1">
              <div className="relative aspect-square bg-gray-200 rounded-2xl mb-6"></div>

              {/* Thumbnail Gallery Skeleton */}
              <div className="flex justify-center gap-3 sm:gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-2">
              {/* Title and Rating */}
              <div>
                <div className="h-12 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-5 h-5 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>

              {/* Price */}
              <div className="h-8 bg-gray-200 rounded-lg w-32"></div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded-full w-20"></div>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="h-12 bg-gray-200 rounded-full w-32"></div>
                <div className="h-12 bg-gray-200 rounded-lg flex-grow"></div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="mt-16">
            <div className="bg-gray-50/50 h-14 rounded-lg mb-6 flex items-center px-4 gap-8">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Tab Content Skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="space-y-2 mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-16">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedSize, setSelectedSize] = useState("500ml");
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    }

    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          notFound();
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    notFound();
  }

  // Create multiple product images (using the same image for demo)
  const productVariants = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    color: colors[i % colors.length].name,
    image: product.imagePath,
  }));

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % productVariants.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + productVariants.length) % productVariants.length);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product.isAvailable) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      toast.success(`Dodano ${quantity} x ${product.name} do koszyka`);
    } catch (error) {
      toast.error("Nie udało się dodać produktu do koszyka");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col mt-20 relative">
      {/* Back Button */}
      <Link href="/sklep" className="absolute top-4 left-20 z-50">
        <Button  size="sm" className="flex text-white tems-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Wróć
        </Button>
      </Link>

      <main className="flex-grow flex flex-col justify-between py-12">
        <div className="w-[90%] lg:w-[80%] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="lg:w-1/2 order-1 lg:order-1 sticky top-24">
              <div className="relative aspect-square">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                  onClick={previousImage}
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>

                <div className="relative w-full h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={productVariants[currentIndex].image}
                    alt={product.name}
                    fill
                    className="object-contain transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4 mt-6">
                {productVariants.slice(0, 5).map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() =>
                      setCurrentIndex(productVariants.findIndex((v) => v.id === variant.id))
                    }
                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all
                      ${currentIndex === productVariants.findIndex((v) => v.id === variant.id) ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-gray-200"}
                    `}
                  >
                    <Image
                      src={variant.image}
                      alt={`${product.name} ${variant.color}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-2">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.8 / {reviews.length} opinii)</span>
                </div>
              </div>

              <p className="text-2xl font-semibold text-primary">
                {formatPLN(product.priceInCents)}
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Rozmiar</h2>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full flex items-center justify-center border-2 text-sm font-medium transition-all
                        ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Wariant</h2>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center
                        ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-primary" : "hover:ring-1 hover:ring-gray-200"}
                      `}
                      style={{ backgroundColor: color.value }}
                    >
                      {selectedColor === color.value && (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    className="rounded-l-full"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="rounded-r-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  className="flex-grow bg-primary text-white hover:bg-primary/90 py-6 text-lg font-medium"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || isAddingToCart}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {isAddingToCart ? "Dodawanie..." : "Dodaj do koszyka"}
                </Button>
                <Button variant="outline" className="p-3" onClick={toggleFavorite}>
                  <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="sr-only">Dodaj do ulubionych</span>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Udostępnij:</span>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Udostępnij na Facebook</span>
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Udostępnij na Twitter</span>
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Udostępnij na Instagram</span>
                  <Instagram className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start bg-gray-50/50 h-auto p-1 rounded-lg">
                <TabsTrigger
                  value="details"
                  className="text-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Szczegóły produktu
                </TabsTrigger>
                <TabsTrigger
                  value="specs"
                  className="text-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Specyfikacja
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Opinie ({reviews.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                    <li>Produkt 100% naturalny, bez dodatków chemicznych</li>
                    <li>Idealny do gotowania, pieczenia i smażenia</li>
                    <li>Doskonały do pielęgnacji skóry i włosów</li>
                    <li>Bogaty w witaminy i minerały</li>
                    <li>Długi termin przydatności</li>
                    <li>Opakowanie przyjazne środowisku</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <tbody>
                      {specifications.map((spec, index) => (
                        <tr key={index} className="border-b">
                          <th className="py-3 pr-4 font-semibold text-gray-900">{spec.label}</th>
                          <td className="py-3 text-gray-700">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {review.initials}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{review.name}</h3>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Może Ci się spodobać</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{relatedProduct.name}</h3>
                  <p className="text-primary font-medium">{formatPLN(relatedProduct.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
