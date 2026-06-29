"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CartButtonProps {
  onClick: () => void;
  itemCount: number;
  className?: string;
  variant?: "ghost" | "floating";
}

export function CartButton({ onClick, itemCount, className, variant = "ghost" }: CartButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "floating") return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setHasScrolled(scrolled);
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  if (itemCount === 0) return null;
  if (variant === "floating" && !hasScrolled) return null;

  const baseButton = (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        aria-label={`Otwórz koszyk${itemCount > 0 ? `, liczba produktów: ${itemCount}` : ""}`}
        className={cn(
          className,
          variant === "floating" &&
            "bg-white hover:bg-white/90 text-foreground shadow-md rounded-full h-14 w-14"
        )}
      >
        <ShoppingCart className={cn("size-7")} />
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center",
            variant === "floating" && "bg-primary text-white"
          )}
        >
          {itemCount}
        </span>
      </Button>
    </div>
  );

  if (variant === "floating") {
    return (
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 transition-all duration-300 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        {baseButton}
      </div>
    );
  }

  return baseButton;
}
