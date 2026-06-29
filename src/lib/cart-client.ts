"use client";

import { toast } from "sonner";

export type CartProductInput = {
  id: string;
  name: string;
  priceInCents: number;
  imagePaths: string[];
  itemsPerPack?: number | null;
};

type CartItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imagePath: string;
  itemsPerPack: number;
};

const toastStyles = {
  style: {
    background: "hsl(var(--primary))",
    border: "none",
    color: "white",
  },
  position: "bottom-right" as const,
};

export function addProductToCart(product: CartProductInput, quantity: number = 1) {
  try {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
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
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

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
    toast.error("Nie udało się dodać produktu do koszyka", {
      style: {
        background: "hsl(var(--destructive))",
        border: "none",
        color: "white",
      },
      position: "bottom-right" as const,
      duration: 3000,
    });
    return false;
  }
}
