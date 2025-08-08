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
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <div className="relative h-screen w-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="px-8 py-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
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
    <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
      {/* Left side - Sticky Photo Window */}
      <div className="lg:sticky lg:top-20 lg:h-[35rem] xl:h-[40rem]">
        <div className="relative h-screen lg:h-[35rem] xl:h-[40rem] w-full overflow-hidden">
          {/* Image Container with Translate X */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {productImages.map((imagePath, index) => (
              <div key={index} className="relative min-w-full h-full lg:h-[35rem] xl:h-[40rem]">
                <Image
                  src={imagePath}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="50vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Dot Navigation */}
          <div className="absolute bottom-8 left-1/2 bg-black/50 rounded-lg p-3 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="absolute top-8 left-8">
            <Link href="/sklep">
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Scrollable Content */}
      <div className="px-8 py-8 lg:py-16">
        <div className="space-y-8">
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

          {/* Nutrition Facts */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 text-center">
              Wartości odżywcze (100ml)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {nutritionFacts.map((fact, index) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-3 bg-primary/5 rounded-lg"
                >
                  <div className="text-base font-bold text-primary mb-1">
                    {fact.value}
                    <span className="text-sm font-normal text-gray-600 ml-1">{fact.unit}</span>
                  </div>
                  <div className="text-sm text-gray-600">{fact.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center border border-gray-900 rounded-lg max-w-xs mx-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-6 py-3 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button
              className="bg-primary hover:bg-primary/90 px-6 py-3 text-sm tracking-wider text-white uppercase transition-colors flex items-center justify-center gap-2 rounded-lg w-full max-w-xs mx-auto"
              onClick={handleAddToCart}
              disabled={!product.isAvailable || isAddingToCart}
            >
              <ShoppingBag className="w-4 h-4" />
              {isAddingToCart ? "DODAWANIE..." : "DODAJ DO KOSZYKA"}
            </button>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-4">
            {/* Product Description */}
            <div className="border-b border-primary/20 pb-1">
              <button
                onClick={() =>
                  setActiveSection(activeSection === "description" ? null : "description")
                }
                className="flex cursor-pointer items-center justify-between w-full text-sm tracking-wider uppercase py-3"
              >
                <span>OPIS PRODUKTU</span>
                <span
                  className={`text-base transition-transform ${activeSection === "description" ? "rotate-180" : ""}`}
                >
                  ⌄
                </span>
              </button>
              {activeSection === "description" && (
                <div className="mt-4 text-sm leading-relaxed text-gray-600 space-y-3">
                  <p>
                    Naturalna woda kokosowa Dr.Coco to czysty, orzeźwiający napój pozyskiwany z
                    młodych zielonych kokosów. Bogata w elektrolity, minerały i witaminy, stanowi
                    idealny naturalny izotonik dla sportowców i osób prowadzących aktywny tryb
                    życia.
                  </p>
                  <p>
                    Każda butelka zawiera 100% naturalną wodę kokosową bez dodatków cukru,
                    konserwantów czy sztucznych barwników. Produkt jest pozyskiwany z młodych,
                    zielonych kokosów, które zawierają najwyższe stężenie składników odżywczych.
                  </p>
                  <p>
                    Woda kokosowa Dr.Coco to doskonałe źródło potasu, magnezu i innych elektrolitów,
                    które pomagają w nawodnieniu organizmu i wspierają prawidłowe funkcjonowanie
                    mięśni.
                  </p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="border-b border-primary/20 pb-1">
              <button
                onClick={() => setActiveSection(activeSection === "details" ? null : "details")}
                className="flex cursor-pointer items-center justify-between w-full text-sm tracking-wider uppercase py-3"
              >
                <span>SZCZEGÓŁY PRODUKTU</span>
                <span
                  className={`text-base transition-transform ${activeSection === "details" ? "rotate-180" : ""}`}
                >
                  ⌄
                </span>
              </button>
              {activeSection === "details" && (
                <div className="mt-4 text-sm leading-relaxed text-gray-600">
                  <ul className="space-y-2">
                    <li>• 100% naturalna woda kokosowa z młodych zielonych kokosów</li>
                    <li>• Bez dodatku cukru, słodzików czy sztucznych substancji</li>
                    <li>• Bogata w elektrolity: potas, magnez, sód, wapń</li>
                    <li>• Naturalne źródło potasu - 250mg w 100ml</li>
                    <li>• Bez konserwantów, barwników i aromatów</li>
                    <li>• Opakowanie przyjazne środowisku - 100% recyklingowalne</li>
                    <li>• Pasteryzowana w niskiej temperaturze dla zachowania składników</li>
                    <li>• Odpowiednia dla wegan i osób na diecie bezglutenowej</li>
                    <li>• Certyfikowana jako produkt organiczny</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Nutritional Information */}
            <div className="border-b border-primary/20 pb-1">
              <button
                onClick={() => setActiveSection(activeSection === "nutrition" ? null : "nutrition")}
                className="flex cursor-pointer items-center justify-between w-full text-sm tracking-wider uppercase py-3"
              >
                <span>WARTOŚCI ODŻYWCZE</span>
                <span
                  className={`text-base transition-transform ${activeSection === "nutrition" ? "rotate-180" : ""}`}
                >
                  ⌄
                </span>
              </button>
              {activeSection === "nutrition" && (
                <div className="mt-4 text-sm leading-relaxed text-gray-600">
                  <ul className="space-y-2">
                    <li>
                      • <strong>Kalorie:</strong> 45 kcal/100ml
                    </li>
                    <li>
                      • <strong>Białko:</strong> 0.5g/100ml
                    </li>
                    <li>
                      • <strong>Węglowodany:</strong> 9g/100ml (w tym cukry naturalne: 6g)
                    </li>
                    <li>
                      • <strong>Tłuszcze:</strong> 0g/100ml
                    </li>
                    <li>
                      • <strong>Błonnik:</strong> 0.5g/100ml
                    </li>
                    <li>
                      • <strong>Potas:</strong> 250mg/100ml (12% dziennego zapotrzebowania)
                    </li>
                    <li>
                      • <strong>Magnez:</strong> 25mg/100ml (6% dziennego zapotrzebowania)
                    </li>
                    <li>
                      • <strong>Sód:</strong> 105mg/100ml (5% dziennego zapotrzebowania)
                    </li>
                    <li>
                      • <strong>Wapń:</strong> 24mg/100ml (2% dziennego zapotrzebowania)
                    </li>
                    <li>
                      • <strong>Witamina C:</strong> 2.4mg/100ml (3% dziennego zapotrzebowania)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Storage Instructions */}
            <div className="border-b border-primary/20 pb-1">
              <button
                onClick={() => setActiveSection(activeSection === "storage" ? null : "storage")}
                className="flex cursor-pointer items-center justify-between w-full text-sm tracking-wider uppercase py-3"
              >
                <span>PRZECHOWYWANIE</span>
                <span
                  className={`text-base transition-transform ${activeSection === "storage" ? "rotate-180" : ""}`}
                >
                  ⌄
                </span>
              </button>
              {activeSection === "storage" && (
                <div className="mt-4 text-sm leading-relaxed text-gray-600">
                  <ul className="space-y-2">
                    <li>
                      • <strong>Przed otwarciem:</strong> Przechowywać w suchym i chłodnym miejscu
                      (temperatura pokojowa)
                    </li>
                    <li>
                      • <strong>Ochrona przed światłem:</strong> Chronić przed bezpośrednim światłem
                      słonecznym
                    </li>
                    <li>
                      • <strong>Po otwarciu:</strong> Przechowywać w lodówce w temperaturze 2-8°C
                    </li>
                    <li>
                      • <strong>Czas spożycia:</strong> Spożyć w ciągu 24 godzin po otwarciu
                    </li>
                    <li>
                      • <strong>Termin przydatności:</strong> 12 miesięcy od daty produkcji
                    </li>
                    <li>
                      • <strong>Data produkcji:</strong> Widoczna na opakowaniu
                    </li>
                    <li>
                      • <strong>Nie zamrażać:</strong> Produkt nie nadaje się do zamrażania
                    </li>
                    <li>
                      • <strong>Przechowywanie:</strong> Utrzymywać opakowanie w pozycji pionowej
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
