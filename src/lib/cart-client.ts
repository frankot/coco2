"use client";

import { toast } from "sonner";
import { trackAddToCart } from "@/lib/analytics";
import { RETAIL_MAX_PACKS_MESSAGE } from "@/lib/order-limits";

export type CartProductInput = {
  id: string;
  name: string;
  priceInCents: number;
  imagePaths: string[];
  itemsPerPack?: number | null;
  isPreorder?: boolean;
  preorderAvailableAt?: string | null;
};

type CartItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imagePath: string;
  itemsPerPack: number;
  isPreorder?: boolean;
  preorderAvailableAt?: string | null;
};

const toastStyles = {
  style: {
    background: "hsl(var(--primary))",
    border: "none",
    color: "white",
  },
  position: "bottom-right" as const,
};

const errorToastStyles = {
  style: {
    background: "hsl(var(--destructive))",
    border: "none",
    color: "white",
  },
  position: "bottom-right" as const,
  duration: 3000,
};

export function addProductToCart(
  product: CartProductInput,
  quantity: number = 1,
  maxPacks: number | null = null
) {
  try {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Retail Pack Limit
    const cartPacks = existingCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    if (maxPacks !== null && cartPacks + quantity > maxPacks) {
      toast.error(RETAIL_MAX_PACKS_MESSAGE, errorToastStyles);
      return false;
    }
    const existingItemIndex = existingCart.findIndex((item: CartItem) => item.id === product.id);
    const wasCartEmpty = existingCart.length === 0;

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        priceInCents: product.priceInCents,
        quantity,
        imagePath: product.imagePaths[0] || "",
        itemsPerPack: product.itemsPerPack || 1,
        isPreorder: product.isPreorder || false,
        preorderAvailableAt: product.preorderAvailableAt || null,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    trackAddToCart(
      { id: product.id, name: product.name, priceInCents: product.priceInCents },
      quantity
    );

    if (wasCartEmpty) {
      window.dispatchEvent(new Event("openCartSheet"));
      return true;
    }

    const totalBottles = quantity * (product.itemsPerPack || 1);
    toast.success(`Dodano ${totalBottles} szt. ${product.name} do koszyka`, {
      ...toastStyles,
      duration: 3000,
    });

    return true;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    toast.error("Nie udało się dodać produktu do koszyka", errorToastStyles);
    return false;
  }
}
