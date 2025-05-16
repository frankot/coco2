"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPLN } from "@/lib/formatter";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Define the Product type based on our database structure
type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  isAvailable: boolean;
};

type FeaturedProductProps = {
  product: Product;
  backgroundColor?: string; // CSS color value, now optional
  imageOnLeft?: boolean; // Changed to boolean - true means image is on left, false means right
};

// Skeleton loader component
export function ProductCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-background/80 border border-primary/10 animate-pulse">
      <div className="relative w-full aspect-square md:aspect-auto overflow-hidden rounded-t-xl bg-secondary/20"></div>
      <div className="flex flex-col justify-between p-6 space-y-4">
        <div className="space-y-4">
          <div className="h-8 bg-primary/10 rounded-md w-3/4"></div>
          <div className="bg-secondary/10 p-4 rounded-lg space-y-2">
            <div className="h-4 bg-primary/10 rounded w-full"></div>
            <div className="h-4 bg-primary/10 rounded w-5/6"></div>
            <div className="h-4 bg-primary/10 rounded w-4/6"></div>
          </div>
          <div className="bg-background/90 border border-primary/30 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-primary/10 rounded w-1/4"></div>
              <div className="h-6 bg-primary/20 rounded w-1/4"></div>
            </div>
            <div className="h-8 bg-primary/10 rounded w-full"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-12 bg-primary/20 rounded-md w-full"></div>
          <div className="h-5 bg-primary/10 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProduct({
  product,
  backgroundColor = "hsl(var(--primary) / 0.2)", // Default to primary color with opacity
  imageOnLeft = true, // Default to image on left if not specified
}: FeaturedProductProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Define order classes based on image position
  const imageOrderClass = imageOnLeft ? "md:order-1" : "md:order-2";
  const contentOrderClass = imageOnLeft ? "md:order-2" : "md:order-1";

  // Define rotation and hover effects
  const rotationAmount = imageOnLeft ? "6deg" : "-6deg";
  const hoverRotationAmount = "0deg";
  const hoverScale = 1.05;

  // Define slide direction based on image position
  const slideDirection = imageOnLeft ? "-50px" : "50px";

  // Define gradient direction based on image position
  const gradientDirection = imageOnLeft ? "to bottom right" : "to bottom left";
  const gradientStyle = {
    background: `linear-gradient(${gradientDirection}, hsl(var(--background)), ${backgroundColor})`,
  };

  // Handle quantity change
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Calculate total price based on quantity (in packs of 12)
  const totalPrice = product.priceInCents * quantity;

  // Add to cart function
  const addToCart = () => {
    if (!product.isAvailable) return;

    setIsAddingToCart(true);

    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Check if product already exists in cart
      const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        existingCart.push({
          id: product.id,
          name: product.name,
          priceInCents: product.priceInCents,
          quantity: quantity,
          imagePath: product.imagePath,
        });
      }

      // Save updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Trigger event for other components to update
      window.dispatchEvent(new Event("cartUpdated"));

      // Show success notification
      toast.success("Produkt dodany do koszyka", {
        description: `${quantity} × ${product.name}`,
        duration: 3000,
      });

      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Nie udało się dodać produktu do koszyka", {
        description: "Spróbuj ponownie później",
      });
    }

    setIsAddingToCart(false);
  };

  // Set up intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden rounded-xl bg-background/80 transition-all duration-1000 ease-out backdrop-blur-sm`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateX(0) scale(1)"
          : `translateX(${slideDirection}) scale(0.98)`,
      }}
    >
      {/* Product image with background */}
      <div
        className={`relative w-full aspect-square md:aspect-auto md:h-full ${imageOrderClass} overflow-hidden rounded-t-xl`}
        style={gradientStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative palm pattern overlay */}
        <div
          className="absolute inset-0 opacity-15  z-0"
          style={{
            backgroundImage: "url('/palmy-prawa.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px)",
          }}
        ></div>

        <div
          className="w-full h-full relative transition-transform duration-500 ease-in-out"
          style={{
            transform: isHovered
              ? `rotate(${hoverRotationAmount}) scale(${hoverScale})`
              : `rotate(${rotationAmount})`,
          }}
        >
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
            priority
          />
        </div>
      </div>

      {/* Product information */}
      <div className={`flex flex-col justify-between p-6 ${contentOrderClass} relative`}>
        <div className="z-10">
          <Link href={`/product/${product.id}`} className="group">
            <h2 className="text-3xl font-galindo mb-3 text-primary group-hover:text-primary/80 transition-colors">
              {product.name}
            </h2>
          </Link>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg mb-4 backdrop-blur-sm">
            <p className="text-foreground/80 line-clamp-3 text-lg">{product.description}</p>
          </div>

          {/* Price section with quantity selector */}
          <div className="bg-background/90 border border-primary/30 rounded-lg p-4 mb-6">
            {/* Price display */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg text-foreground/80">Cena:</span>
              <span className="text-2xl font-bold text-primary font-galindo">
                {formatPLN(totalPrice)}
              </span>
            </div>

            {/* Quantity selector */}
            <div className="mb-2">
              <p className="text-sm text-foreground/60 mb-2">
                (Sprzedawane w paczkach po 12 sztuk)
              </p>
              <div className="flex items-center">
                <span className="mr-4 text-foreground/80">Ilość paczek:</span>
                <div className="flex items-center border border-primary/30 rounded-md overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className={cn(
                      "px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors",
                      quantity <= 1 && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-1 font-medium text-center w-12 bg-background/90">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 z-10">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 font-bold text-lg group shadow-none"
            disabled={!product.isAvailable || isAddingToCart}
            onClick={addToCart}
          >
            <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            {isAddingToCart ? "Dodawanie..." : "Dodaj do koszyka"}
          </Button>
          <Link
            href={`/sklep/${product.id}`}
            className="text-center text-sm text-primary hover:text-primary/80 font-medium hover:underline"
          >
            Zobacz szczegóły →
          </Link>
        </div>
      </div>
    </div>
  );
}
