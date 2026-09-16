"use client";

import { useEffect, useRef } from "react";
import { PAYMENT_CONFIRMED_EVENT, trackPurchase } from "@/lib/analytics";
import type { DrCocoOrderItem } from "@/lib/analytics";

type PurchaseTrackerProps = {
  orderId: string;
  isPaid: boolean;
  shippingGross?: number; // in cents
  discountGross?: number; // in cents
  coupon?: string;
  items: DrCocoOrderItem[];
};

export function PurchaseTracker({
  orderId,
  isPaid,
  shippingGross,
  discountGross,
  coupon,
  items,
}: PurchaseTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      // trackPurchase owns the once-per-order guard
      trackPurchase({ id: orderId, shippingGross, discountGross, coupon, items });
    };

    if (isPaid) {
      fire();
      return;
    }

    // Stripe: the webhook can land after this page renders — verifyClient signals us
    window.addEventListener(PAYMENT_CONFIRMED_EVENT, fire);
    return () => window.removeEventListener(PAYMENT_CONFIRMED_EVENT, fire);
  }, [orderId, isPaid, shippingGross, discountGross, coupon, items]);

  return null;
}
