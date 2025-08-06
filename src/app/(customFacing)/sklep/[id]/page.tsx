"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Leaf,
  Droplet,
  Heart,
  Award,
  Check,
  Thermometer,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatPLN } from "@/lib/formatter";
import { useCart } from "@/app/(customFacing)/components/Cart";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("500ml");
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
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

  const productImages = [product.imagePath, product.imagePath, product.imagePath];
  const [selectedImage, setSelectedImage] = useState(0);

  const nutritionFacts = [
    { label: "Kalorie", value: "45", unit: "kcal", icon: Droplet },
    { label: "Potas", value: "600", unit: "mg", icon: Heart },
    { label: "Cukry", value: "6", unit: "g", icon: Leaf },
    { label: "Wapń", value: "58", unit: "mg", icon: Award },
  ];

  const benefits = [
    { icon: Leaf, title: "Naturalne elektrolity", desc: "Bogate w potas i magnez" },
    { icon: Droplet, title: "Nawodnienie", desc: "Idealne do nawodnienia organizmu" },
    { icon: Award, title: "Bez dodatków", desc: "100% naturalna bez konserwantów" },
    { icon: Thermometer, title: "Orzeźwiające", desc: "Doskonałe na upały" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/sklep">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do sklepu
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Leaf className="w-4 h-4" />
                Dr.Coco
              </div>
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-green-600">
                  {formatPLN(product.priceInCents)}
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Dostępny</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <benefit.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{benefit.title}</h4>
                      <p className="text-xs text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Wybierz rozmiar:</h3>
              <div className="flex gap-3">
                {["250ml", "500ml", "1L"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {formatPLN(product.priceInCents * quantity)}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.isAvailable || isAddingToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Dodawanie..." : "Dodaj do koszyka"}
              </Button>
            </div>

            {/* Nutrition Facts */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Wartości odżywcze (100ml)</h3>
              <div className="grid grid-cols-2 gap-4">
                {nutritionFacts.map((fact, index) => (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <fact.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {fact.value}
                        <span className="text-sm font-normal text-gray-600 ml-1">{fact.unit}</span>
                      </div>
                      <div className="text-sm text-gray-600">{fact.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Product Details */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setActiveSection(activeSection === "details" ? null : "details")}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-semibold text-gray-900">Szczegóły produktu</span>
                  <span
                    className={`transition-transform ${activeSection === "details" ? "rotate-180" : ""}`}
                  >
                    ⌄
                  </span>
                </button>
                {activeSection === "details" && (
                  <div className="px-4 pb-4 text-gray-600 space-y-2">
                    <p>• 100% naturalna woda kokosowa</p>
                    <p>• Bez dodatku cukru</p>
                    <p>• Bogata w elektrolity</p>
                    <p>• Naturalne źródło potasu</p>
                    <p>• Bez konserwantów</p>
                    <p>• Opakowanie przyjazne środowisku</p>
                  </div>
                )}
              </div>

              {/* Storage Instructions */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setActiveSection(activeSection === "storage" ? null : "storage")}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-semibold text-gray-900">Przechowywanie</span>
                  <span
                    className={`transition-transform ${activeSection === "storage" ? "rotate-180" : ""}`}
                  >
                    ⌄
                  </span>
                </button>
                {activeSection === "storage" && (
                  <div className="px-4 pb-4 text-gray-600 space-y-2">
                    <p>• Przechowywać w suchym i chłodnym miejscu</p>
                    <p>• Chronić przed bezpośrednim światłem słonecznym</p>
                    <p>• Po otwarciu przechowywać w lodówce</p>
                    <p>• Spożyć w ciągu 24h po otwarciu</p>
                    <p>• Termin przydatności: 12 miesięcy</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
