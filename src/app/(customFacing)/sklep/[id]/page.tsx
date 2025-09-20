"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatPLN } from "@/lib/formatter";
import { useCart } from "@/app/(customFacing)/components/Cart";
import { toast } from "sonner";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

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
      await addToCart(product, quantity);
      toast.success(`Dodano ${quantity} x ${product.name} do koszyka`);
    } catch (error) {
      toast.error("Nie udało się dodać produktu do koszyka");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Mock multiple product images - in real app, these would come from the product data
  const productImages = [
    product.imagePath,
    product.imagePath,
    product.imagePath,
    product.imagePath,
  ];

  const pricePerUnit = product.priceInCents / 100; // Assuming single unit for now

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-20">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/sklep">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-primary"
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
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail images */}
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 relative bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
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
              <div className="text-sm text-gray-600">{formatPLN(pricePerUnit * 100)} / za szt.</div>
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

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ocena:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Short description */}
            <div className="space-y-2">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>- Pyszny smak młodego kokosa</p>
                <p>- Wyborny shot z minerałami</p>
                <p>- Nawadnia lepiej niż woda</p>
                <p>- Idealna dla sportowców i świadomych konsumentów</p>
                <p>- Świetnie komponuje się z owocami i warzywami w koktajlach czy smoothies</p>
              </div>
            </div>

            {/* Additional info links */}
            <div className="space-y-2 text-sm">
              <button className="flex items-center gap-2 text-primary hover:underline">
                <span>📞</span>
                zapytaj o produkt
              </button>
              <button className="flex items-center gap-2 text-primary hover:underline">
                <span>💚</span>
                poleć znajomemu
              </button>
            </div>
          </div>
        </div>

        {/* Full-width description section */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-2 font-medium ${
                activeTab === "description"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Opis
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

          {activeTab === "description" && (
            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skład:</h3>
                  <p className="text-gray-700 mb-4">
                    woda kokosowa z młodego kokosa (99,96%), kwas L-askorbinowy.
                  </p>

                  <h3 className="text-lg font-semibold mb-3">Sposób przechowywania:</h3>
                  <p className="text-gray-700 mb-4">
                    Przechowuj w suchym i chłodnym miejscu. Po otwarciu trzymaj w lodówce nie dłużej
                    niż 2 dni.
                  </p>

                  <h3 className="text-lg font-semibold mb-3">
                    Wartość odżywcza w 100 ml produktu:
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p>Wartość energetyczna (kJ/ kcal) - 94/22</p>
                    <p>Tłuszcz (g) - 0, w tym kwasy tłuszczowe (g) - 0</p>
                    <p>Węglowodany (g) - 5,5, w tym cukry (g) - 5,2</p>
                    <p>Sól (g) - 0,05</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Prosty i naturalny skład</h3>
                  <p className="text-gray-700 mb-4">
                    COCONAUT® to wyłącznie naturalna woda kokosowa produkowana w Wietnamie z
                    najlepszych młodych kokosów.
                  </p>

                  <p className="text-gray-700 mb-4">
                    Nasza woda kokosowa COCONAUT® to produkt odpowiedni dla wegan, co gwarantuje
                    certyfikat V-label.
                  </p>

                  <p className="text-gray-700">
                    V-Label to uznawane na całym świecie oznaczenie produktów i usług wegańskich
                    oraz wegetariańskich, zarejestrowane w Szwajcarii w 1996 roku. V-Label stanowi
                    niezawodną wskazówkę podczas zakupów.
                  </p>
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
