"use client";

import { useEffect } from "react";
import { COOKIE_CONSENT_EVENT, trackMetaPixelEvent } from "@/lib/meta-pixel";

type PurchaseItem = {
  productId: string;
  quantity: number;
};

export function PurchaseTracker({
  orderId,
  value,
  items,
}: {
  orderId: string;
  value: number;
  items: PurchaseItem[];
}) {
  useEffect(() => {
    const key = `fb_purchase_tracked_${orderId}`;
    const sendPurchase = () => {
      if (sessionStorage.getItem(key)) return;
      const tracked = trackMetaPixelEvent("Purchase", {
        value,
        currency: "PLN",
        content_ids: items.map((item) => item.productId),
        content_type: "product",
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      });
      if (tracked) sessionStorage.setItem(key, "1");
    };

    sendPurchase();
    window.addEventListener(COOKIE_CONSENT_EVENT, sendPurchase);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sendPurchase);
  }, [items, orderId, value]);

  return null;
}
