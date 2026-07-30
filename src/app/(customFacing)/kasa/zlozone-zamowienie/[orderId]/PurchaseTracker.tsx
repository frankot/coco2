"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";
import type { DrCocoOrder } from "@/lib/analytics";

type PurchaseTrackerProps = {
  orderId: string;
  totalGross: number; // in cents
  shippingGross?: number; // in cents
  taxValue?: number; // in cents
  items: Array<{
    productId: string;
    productName: string;
    unitPriceGross: number; // in cents
    quantity: number;
  }>;
};

export function PurchaseTracker({
  orderId,
  totalGross,
  shippingGross,
  taxValue,
  items,
}: PurchaseTrackerProps) {
  useEffect(() => {
    const key = `purchase_tracked_${orderId}`;
    if (sessionStorage.getItem(key)) return;

    const order: DrCocoOrder = {
      id: orderId,
      totalGross,
      taxValue,
      shippingGross,
      items,
    };

    trackPurchase(order);
    sessionStorage.setItem(key, "1");
  }, [items, orderId, totalGross, shippingGross, taxValue]);

  return null;
}
