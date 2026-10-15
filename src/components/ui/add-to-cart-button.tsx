"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { addProductToCart, type CartProductInput } from "@/lib/cart-client";
import { useMaxPacks } from "@/lib/use-max-packs";

interface AddToCartButtonProps {
  product: CartProductInput;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  idleContent: ReactNode;
  loadingContent: ReactNode;
  stopLinkNavigation?: boolean;
}

export function AddToCartButton({
  product,
  disabled,
  className,
  size = "default",
  idleContent,
  loadingContent,
  stopLinkNavigation = false,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const maxPacks = useMaxPacks();

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (stopLinkNavigation) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (disabled || isAdding) return;

    setIsAdding(true);
    addProductToCart(product, 1, maxPacks);
    window.setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <Button
      size={size}
      className={className}
      disabled={disabled || isAdding}
      onClick={handleAddToCart}
    >
      {isAdding ? loadingContent : idleContent}
    </Button>
  );
}
