"use client";

import { toast } from "sonner";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";

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
        isPreorder: product.isPreorder || false,
        preorderAvailableAt: product.preorderAvailableAt || null,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    trackMetaPixelEvent("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: (product.priceInCents * quantity) / 100,
      currency: "PLN",
    });

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
