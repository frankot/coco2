"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Leaf, Droplet, Heart, Award, Check } from "lucide-react";
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
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="space-y-0 border-r border-primary/20">
            <div className="relative h-screen w-full bg-gray-200 animate-pulse"></div>
            <div className="relative h-screen w-full bg-gray-200 animate-pulse"></div>
            <div className="relative h-screen w-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
        <div className="lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1">
          <div className="flex h-[700px] flex-col justify-center px-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
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

  const nutritionFacts = [
    { label: "Kalorie", value: "45", unit: "kcal", icon: Droplet },
    { label: "Potas", value: "600", unit: "mg", icon: Heart },
    { label: "Cukry", value: "6", unit: "g", icon: Leaf },
    { label: "Wapń", value: "58", unit: "mg", icon: Award },
  ];

  return (
    <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {/* Left side - Images in natural flow */}
      <div className="lg:col-start-1 lg:row-start-1">
        <div className="space-y-0 border-r border-primary/20">
          {/* Main product image */}
          <div className="relative h-screen w-full">
            <Image
              src={productImages[0]}
              alt={product.name}
              fill
              className="bg-gradient-to-br from-primary/5 to-primary/10 object-cover p-24"
              sizes="50vw"
              priority
            />
          </div>

          {/* Additional images - each taking full screen height */}
          {productImages.slice(1).map((imagePath, index) => (
            <div key={index} className="relative h-screen w-full">
              <Image
                src={imagePath}
                alt={`${product.name} ${index + 2}`}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Sticky Product Info */}
      <div className="lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1">
        <div className="flex h-[700px] flex-col justify-center px-8">
          <div className="space-y-6">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link href="/sklep">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Wróć do sklepu
                </Button>
              </Link>
            </motion.div>

            {/* Product Title and Price */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Leaf className="w-4 h-4" />
                Dr.Coco
              </div>
              <h1 className="text-[28px] leading-8 font-[500] tracking-wide uppercase">
                {product.name}
              </h1>
              <div className="mt-3">
                <p className="text-sm font-semibold text-primary">
                  {formatPLN(product.priceInCents)}
                </p>
              </div>
              <hr className="mx-auto mt-5 w-20 border-primary" />
            </div>

            {/* Product Description */}
            <div className="text-center">
              <p className="text-xs leading-relaxed text-gray-600">{product.description}</p>
            </div>

            {/* Cart Controls and Nutrition Facts - 2 Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Nutrition Facts */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 text-center">
                  Wartości odżywcze (100ml)
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {nutritionFacts.map((fact, index) => (
                    <motion.div
                      key={fact.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-2 bg-primary/5 rounded-lg"
                    >
                      <div className="text-sm font-bold text-primary mb-1">
                        {fact.value}
                        <span className="text-xs font-normal text-gray-600 ml-1">{fact.unit}</span>
                      </div>
                      <div className="text-xs text-gray-600">{fact.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column - Cart Controls */}
              <div className="flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-center border border-gray-900 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-primary hover:bg-primary/90 px-4 py-2 text-xs tracking-wider text-white uppercase transition-colors flex items-center justify-center gap-2 rounded-lg"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || isAddingToCart}
                >
                  <ShoppingBag className="w-3 h-3" />
                  {isAddingToCart ? "DODAWANIE..." : "DODAJ"}
                </button>
              </div>
            </div>

            {/* Collapsible Sections - 2 Column Layout */}
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  {/* Product Description */}
                  <div className="border-b border-primary/20 pb-1">
                    <button
                      onClick={() =>
                        setActiveSection(activeSection === "description" ? null : "description")
                      }
                      className="flex cursor-pointer items-center justify-between w-full text-xs tracking-wider uppercase py-2"
                    >
                      <span>OPIS PRODUKTU</span>
                      <span
                        className={`text-base transition-transform ${activeSection === "description" ? "rotate-180" : ""}`}
                      >
                        ⌄
                      </span>
                    </button>
                    {activeSection === "description" && (
                      <div className="mt-3 text-xs leading-relaxed text-gray-600">
                        <p>
                          Naturalna woda kokosowa Dr.Coco to czysty, orzeźwiający napój pozyskiwany
                          z młodych zielonych kokosów. Bogata w elektrolity, minerały i witaminy,
                          stanowi idealny naturalny izotonik.
                        </p>
                        <p className="mt-2">
                          Każda butelka zawiera 100% naturalną wodę kokosową bez dodatków cukru,
                          konserwantów czy sztucznych barwników.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="border-b border-primary/20 pb-1">
                    <button
                      onClick={() =>
                        setActiveSection(activeSection === "details" ? null : "details")
                      }
                      className="flex cursor-pointer items-center justify-between w-full text-xs tracking-wider uppercase py-2"
                    >
                      <span>SZCZEGÓŁY PRODUKTU</span>
                      <span
                        className={`text-base transition-transform ${activeSection === "details" ? "rotate-180" : ""}`}
                      >
                        ⌄
                      </span>
                    </button>
                    {activeSection === "details" && (
                      <div className="mt-3 text-xs leading-relaxed text-gray-600">
                        <ul className="space-y-1">
                          <li>• 100% naturalna woda kokosowa</li>
                          <li>• Bez dodatku cukru</li>
                          <li>• Bogata w elektrolity</li>
                          <li>• Naturalne źródło potasu</li>
                          <li>• Bez konserwantów</li>
                          <li>• Opakowanie przyjazne środowisku</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {/* Nutritional Information */}
                  <div className="border-b border-primary/20 pb-1">
                    <button
                      onClick={() =>
                        setActiveSection(activeSection === "nutrition" ? null : "nutrition")
                      }
                      className="flex cursor-pointer items-center justify-between w-full text-xs tracking-wider uppercase py-2"
                    >
                      <span>WARTOŚCI ODŻYWCZE</span>
                      <span
                        className={`text-base transition-transform ${activeSection === "nutrition" ? "rotate-180" : ""}`}
                      >
                        ⌄
                      </span>
                    </button>
                    {activeSection === "nutrition" && (
                      <div className="mt-3 text-xs leading-relaxed text-gray-600">
                        <ul className="space-y-1">
                          <li>• Kalorie: 45 kcal/100ml</li>
                          <li>• Białko: 0.5g/100ml</li>
                          <li>• Węglowodany: 9g/100ml</li>
                          <li>• Tłuszcze: 0g/100ml</li>
                          <li>• Potas: 250mg/100ml</li>
                          <li>• Magnez: 25mg/100ml</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Storage Instructions */}
                  <div className="border-b border-primary/20 pb-1">
                    <button
                      onClick={() =>
                        setActiveSection(activeSection === "storage" ? null : "storage")
                      }
                      className="flex cursor-pointer items-center justify-between w-full text-xs tracking-wider uppercase py-2"
                    >
                      <span>PRZECHOWYWANIE</span>
                      <span
                        className={`text-base transition-transform ${activeSection === "storage" ? "rotate-180" : ""}`}
                      >
                        ⌄
                      </span>
                    </button>
                    {activeSection === "storage" && (
                      <div className="mt-3 text-xs leading-relaxed text-gray-600">
                        <ul className="space-y-1">
                          <li>• Przechowywać w suchym i chłodnym miejscu</li>
                          <li>• Chronić przed bezpośrednim światłem słonecznym</li>
                          <li>• Po otwarciu przechowywać w lodówce</li>
                          <li>• Spożyć w ciągu 24h po otwarciu</li>
                          <li>• Termin przydatności: 12 miesięcy</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
