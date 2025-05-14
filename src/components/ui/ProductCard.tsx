"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPLN } from "@/lib/formatter";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

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
  backgroundColor: string; // CSS color value
  imageOnLeft?: boolean; // Changed to boolean - true means image is on left, false means right
};

export default function FeaturedProduct({
  product,
  backgroundColor,
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

  // Define rotation based on image position
  const rotationAmount = imageOnLeft ? "12deg" : "-12deg";
  const hoverRotationAmount = "0deg";

  // Define slide direction based on image position
  const slideDirection = imageOnLeft ? "-50px" : "50px";

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
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-1000 ease-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateX(0) scale(1)"
          : `translateX(${slideDirection}) scale(0.98)`,
      }}
    >
      {/* Product image with background */}
      <div
        className={`relative w-full aspect-square md:aspect-auto md:h-full ${imageOrderClass} overflow-hidden`}
        style={{ backgroundColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="w-full h-full relative transition-transform duration-500 ease-in-out"
          style={{
            transform: isHovered ? `rotate(${hoverRotationAmount})` : `rotate(${rotationAmount})`,
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

      {/* Product information - Redesigned for teenage brand */}
      <div className={`flex flex-col justify-between p-6 ${contentOrderClass} relative`}>
        {/* Fun pattern overlay for background */}
        <div
          className="absolute inset-0 opacity-5 z-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="z-10">
          <Link href={`/product/${product.id}`} className="group">
            <h2 className="text-3xl font-bold mb-2 text-pink-600 group-hover:text-pink-500 transition-colors">
              {product.name}
            </h2>
          </Link>

          <div className="bg-gradient-to-r from-yellow-100 to-pink-100 p-4 rounded-lg mb-4">
            <p className="text-gray-600 line-clamp-3 text-lg">{product.description}</p>
          </div>

          {/* Price section with quantity selector */}
          <div className="bg-white border-2 border-dashed border-pink-200 rounded-lg p-4 mb-6">
            {/* Price display */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg text-gray-700">Cena:</span>
              <span className="text-2xl font-bold text-pink-600">{formatPLN(totalPrice)}</span>
            </div>

            {/* Quantity selector */}
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-2">(Sprzedawane w paczkach po 12 sztuk)</p>
              <div className="flex items-center">
                <span className="mr-4 text-gray-700">Ilość paczek:</span>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-1 font-medium text-center w-12">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
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
            className="w-full bg-pink-500 hover:bg-pink-600 font-bold text-lg group"
            disabled={!product.isAvailable || isAddingToCart}
            onClick={addToCart}
          >
            <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            {isAddingToCart ? "Dodawanie..." : "Dodaj do koszyka"}
          </Button>
          <Link
            href={`/product/${product.id}`}
            className="text-center text-sm text-pink-600 hover:text-pink-700 font-medium hover:underline"
          >
            Zobacz szczegóły →
          </Link>
        </div>
      </div>
    </div>
  );
}
