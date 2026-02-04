"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatPLN } from "@/lib/formatter";
import { useCart } from "@/app/(customFacing)/components/Cart";
import ReactMarkdown from "react-markdown";
// Toasts are handled inside useCart().addToCart

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("composition");

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

  // Reset selected image if it's out of bounds when product changes
  useEffect(() => {
    if (product && product.imagePaths) {
      const productImages = product.imagePaths.filter(Boolean) || [];
      const displayImages = productImages.length > 0 ? productImages : ["/hero.webp"];
      if (selectedImage >= displayImages.length) {
        setSelectedImage(0);
      }
    }
  }, [product, selectedImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 pt-20">
          {/* Back button */}
          <div className="mb-6">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Main product section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Images */}
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Right - Product info */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    if (!product.isAvailable) return;

    setIsAddingToCart(true);
    try {
      // Notifications are shown by addToCart itself
      await addToCart(product, quantity);
    } catch (error) {
      // Error notification is handled by addToCart
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get product images, filter out empty ones, and provide fallback
  const productImages = product.imagePaths?.filter(Boolean) || [];
  const hasImages = productImages.length > 0;
  const displayImages = hasImages ? productImages : ["/hero.webp"]; // fallback to a default image
  const itemsPerPack = product.itemsPerPack || 12;
  const pricePerUnit = product.priceInCents / itemsPerPack;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4  py-10 lg:py-20">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/sklep">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600  hover:bg-secondary/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do sklepu
            </Button>
          </Link>
        </div>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left side - Product Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square  rounded-lg overflow-hidden">
              {displayImages[selectedImage] ? (
                <Image
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Brak zdjęcia
                </div>
              )}

              {/* Badge showing items per pack */}
              <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg text-lg font-semibold shadow-lg">
                {itemsPerPack}x
              </div>
            </div>

            {/* Thumbnail images - only show if there are multiple images */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 relative bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        Brak
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Product Info */}
          <div className="space-y-6">
            {/* Product title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Wysyłka w:</span>
                <span className="font-medium">1 dzień roboczy + czas dostawy</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                {formatPLN(product.priceInCents)}
              </div>
              <div className="text-sm text-gray-600">
                {formatPLN(pricePerUnit)} / za szt. • Zestaw {itemsPerPack} sztuk
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">szt.</span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.isAvailable || isAddingToCart}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Dodawanie..." : "Do koszyka"}
              </Button>
            </div>

            {/* Full description with markdown content */}
            <div className="space-y-2">
              {product.content ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                      p: ({ node, ...props }) => <p className="text-gray-700 mb-2 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-700 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="text-gray-700 mb-1" {...props} />,
                    }}
                  >
                    {product.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Composition and related section */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("composition")}
              className={`pb-2 font-medium ${
                activeTab === "composition"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Skład i Wartości
            </button>
            <button
              onClick={() => setActiveTab("related")}
              className={`pb-2 font-medium ${
                activeTab === "related"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Produkty powiązane
            </button>
          </div>

          {activeTab === "composition" && (
            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {product.composition?.ingredients && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Skład:</h3>
                      <div className="text-gray-700 mb-4">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          }}
                        >
                          {product.composition.ingredients}
                        </ReactMarkdown>
                      </div>
                    </>
                  )}

                  {product.composition?.storage && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Sposób przechowywania:</h3>
                      <div className="text-gray-700 mb-4">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          }}
                        >
                          {product.composition.storage}
                        </ReactMarkdown>
                      </div>
                    </>
                  )}

                  {product.composition?.nutritionPerHundredMl && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Wartość odżywcza w 100 ml produktu:</h3>
                      <div className="text-gray-700 space-y-1">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-1" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          }}
                        >
                          {product.composition.nutritionPerHundredMl}
                        </ReactMarkdown>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "related" && (
            <div className="text-center py-8 text-gray-500">
              Produkty powiązane będą dostępne wkrótce
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
