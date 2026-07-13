"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatPLN } from "@/lib/formatter";
import { addProductToCart } from "@/lib/cart-client";
import { COOKIE_CONSENT_EVENT, trackMetaPixelEvent } from "@/lib/meta-pixel";
import ReactMarkdown from "react-markdown";
import AvailabilityNotificationForm from "./AvailabilityNotificationForm";

export default function ProductPageClient({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("composition");
  const [now, setNow] = useState(Date.now());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const viewedProductRef = useRef<string | null>(null);
  const minSwipeDistance = 40;

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

  useEffect(() => {
    if (!product || viewedProductRef.current === product.id) return;
    const sendViewContent = () => {
      if (viewedProductRef.current === product.id) return;
      const tracked = trackMetaPixelEvent("ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.priceInCents / 100,
        currency: "PLN",
      });
      if (tracked) viewedProductRef.current = product.id;
    };
    sendViewContent();
    window.addEventListener(COOKIE_CONSENT_EVENT, sendViewContent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sendViewContent);
  }, [product]);

  useEffect(() => {
    if (!product?.isPreorder) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [product?.isPreorder]);

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
      <div className="min-h-screen lg:pt-18">
        <div className="container mx-auto px-4 pt-4 pb-10 lg:pt-10 lg:pb-20">
          {/* Back button - real, always works */}
          <div className="mb-6">
            <Link href="/sklep">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-600 hover:bg-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć do sklepu
              </Button>
            </Link>
          </div>

          {/* Main product section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Left - Images skeleton */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Right - Product info: mix of skeleton + static */}
            <div className="space-y-6">
              {/* Title skeleton */}
              <div>
                <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse mb-2" />

              </div>

              {/* Price skeleton */}
              <div className="space-y-2">
                <div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
              </div>

              {/* Quantity + Cart - real controls, cart disabled */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button className="p-2 text-gray-400 cursor-default" disabled>
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[60px] text-center text-gray-400">
                      12
                    </span>
                    <button className="p-2 text-gray-400 cursor-default" disabled>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">szt. (1 × ?)</span>
                </div>

                <Button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 text-lg font-medium cursor-not-allowed"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ładowanie...
                </Button>
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>

          {/* Tabs - real, always visible */}
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

            {activeTab === "composition" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-5 w-40 bg-gray-100 rounded animate-pulse mt-4" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mt-4" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Produkty powiązane będą dostępne wkrótce
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const preorderEndsAtMs = product.preorderAvailableAt
    ? new Date(product.preorderAvailableAt).getTime()
    : 0;
  const isPreorderActive = product.isPreorder && preorderEndsAtMs > now;
  const preorderDiscount =
    product.isPreorder && product.preorderOriginalPriceInCents
      ? Math.max(0, Math.round((1 - product.priceInCents / product.preorderOriginalPriceInCents) * 100))
      : 0;
  const countdownMs = Math.max(0, preorderEndsAtMs - now);
  const countdownDays = Math.floor(countdownMs / 86_400_000);
  const countdownHours = Math.floor((countdownMs % 86_400_000) / 3_600_000);
  const countdownMinutes = Math.floor((countdownMs % 3_600_000) / 60_000);
  const countdownSeconds = Math.floor((countdownMs % 60_000) / 1000);

  const handleAddToCart = async () => {
    if (!product.isAvailable && !isPreorderActive) return;

    setIsAddingToCart(true);
    try {
      addProductToCart(product, quantity);
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
    <div className="min-h-screen lg:pt-18">
      {/* Promo banner */}
      {product.promo && (
        <div className="bg-primary text-white text-center text-sm font-semibold uppercase tracking-wide py-2">
          Promocja
        </div>
      )}

      <div className="container mx-auto px-4 pt-4 pb-10 lg:pt-10 lg:pb-20 ">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/sklep">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600  hover:bg-primary"
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
            <div
              className="relative aspect-square rounded-lg overflow-hidden"
              onTouchStart={(e) => {
                setTouchEnd(null);
                setTouchStart(e.targetTouches[0].clientX);
              }}
              onTouchMove={(e) => {
                setTouchEnd(e.targetTouches[0].clientX);
              }}
              onTouchEnd={() => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                const isLeftSwipe = distance > minSwipeDistance;
                const isRightSwipe = distance < -minSwipeDistance;

                if (isLeftSwipe) {
                  setSelectedImage((prev) => (prev + 1) % displayImages.length);
                } else if (isRightSwipe) {
                  setSelectedImage(
                    (prev) => (prev - 1 + displayImages.length) % displayImages.length
                  );
                }
              }}
            >
              {displayImages[selectedImage] ? (
                <Image
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) calc(100vw - 32px), 50vw"
                  preload={selectedImage === 0}
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
                    aria-label={`Pokaż zdjęcie ${index + 1} produktu ${product.name}`}
                    aria-current={selectedImage === index ? "true" : undefined}
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

            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.isPreorder && (
                <div className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                  PREORDER
                </div>
              )}
              {product.isPreorder && product.preorderOriginalPriceInCents && (
                <div className="text-lg text-gray-400 line-through">
                  {formatPLN(product.preorderOriginalPriceInCents)}
                </div>
              )}
              <div className="text-3xl font-bold text-gray-900">
                {formatPLN(product.priceInCents)}
              </div>
              <div className="text-sm text-gray-600">
                {formatPLN(pricePerUnit)} / za szt. • Zestaw {itemsPerPack} sztuk
              </div>
              {preorderDiscount > 0 && (
                <div className="text-sm font-semibold text-primary">
                  Rabat preorder: -{preorderDiscount}%
                </div>
              )}
              <div className="text-xs text-gray-400">
                Najniższa cena w ciągu ostatnich 30 dni:{" "}
                <span className="font-medium">
                  {formatPLN(product.lastPriceInCents ?? product.priceInCents)}
                </span>
              </div>
            </div>

            {/* Purchase State */}
            {product.isPreorder ? (
              <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-5 space-y-4">
                <div>
                  <p className="font-semibold text-primary">Planowana dostępność</p>
                  <p className="text-sm text-gray-700">
                    {product.preorderAvailableAt
                      ? new Intl.DateTimeFormat("pl-PL", {
                          dateStyle: "long",
                          timeStyle: "short",
                        }).format(new Date(product.preorderAvailableAt))
                      : "—"}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <CountdownBox label="dni" value={countdownDays} />
                  <CountdownBox label="godz." value={countdownHours} />
                  <CountdownBox label="min" value={countdownMinutes} />
                  <CountdownBox label="sek" value={countdownSeconds} />
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!isPreorderActive || isAddingToCart}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium disabled:cursor-not-allowed disabled:opacity-70"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {!isPreorderActive
                    ? "Preorder zakończony"
                    : isAddingToCart
                      ? "Dodawanie..."
                      : "Zamów w preorderze"}
                </Button>
              </div>
            ) : product.isAvailable ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="min-h-12 min-w-12 p-2 hover:bg-gray-100 transition-colors"
                      aria-label={`Zmniejsz ilość produktu ${product.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                      {quantity * itemsPerPack}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="min-h-12 min-w-12 p-2 hover:bg-gray-100 transition-colors"
                      aria-label={`Zwiększ ilość produktu ${product.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    szt. ({quantity} × {itemsPerPack})
                  </span>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {isAddingToCart ? "Dodawanie..." : "Do koszyka"}
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <div>
                  <p className="font-semibold text-primary">Produkt jest chwilowo niedostępny</p>
                  <p className="text-sm text-gray-600">
                    Zostaw adres e-mail, a poinformujemy Cię, gdy produkt wróci do sprzedaży.
                  </p>
                </div>
                <AvailabilityNotificationForm productId={product.id} />
              </div>
            )}

            {/* Full description with markdown content */}
            <div className="space-y-2">
              {product.content ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h2 className="text-2xl font-bold mt-4 mb-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h3 className="text-xl font-bold mt-3 mb-2" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h4 className="text-lg font-semibold mt-2 mb-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-gray-700 mb-2 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside text-gray-700 mb-2" {...props} />
                      ),
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
              aria-pressed={activeTab === "composition"}
              className={`pb-2 font-medium min-h-12 ${
                activeTab === "composition"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Skład i Wartości
            </button>
            <button
              onClick={() => setActiveTab("related")}
              aria-pressed={activeTab === "related"}
              className={`pb-2 font-medium min-h-12 ${
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
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc list-inside" {...props} />
                            ),
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
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc list-inside" {...props} />
                            ),
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
                      <h3 className="text-lg font-semibold mb-3">
                        Wartość odżywcza w 100 ml produktu:
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-1" {...props} />,
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc list-inside" {...props} />
                            ),
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

function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-primary/10 bg-white/80 p-3 shadow-sm">
      <div className="text-xl font-bold text-primary">{String(value).padStart(2, "0")}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
