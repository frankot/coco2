// Analytics — GTM dataLayer helpers + cookie consent
// Hard-coded for Dr.Coco (GTM-MQ3CND2M → GA4 G-N3N1V1116L)
// Based on drcoco_analytics_helper.ts

export const GTM_ID = "GTM-MQ3CND2M";
export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookieConsentChanged";

// ── Types ──────────────────────────────────────────────

export type DrCocoProduct = {
  id: string;
  name: string;
  priceInCents: number;
  itemsPerPack?: number;
};

export type DrCocoCartItem = DrCocoProduct & {
  quantity: number;
};

export type DrCocoOrder = {
  id: string;
  totalGross: number; // in cents
  taxValue?: number; // in cents
  shippingGross?: number; // in cents
  items: Array<{
    productId: string;
    productName: string;
    unitPriceGross: number; // in cents
    quantity: number;
  }>;
};

type Ga4Item = {
  item_id: string;
  item_name: string;
  item_brand: string;
  item_category: string;
  price: number;
  quantity: number;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

// ── Helpers ────────────────────────────────────────────

function toMoney(valueInCents: number): number {
  return Math.round((valueInCents / 100) * 100) / 100;
}

function cartValue(items: DrCocoCartItem[]): number {
  return (
    Math.round(
      items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0)
    ) / 100
  );
}

export function mapProductToGa4Item(
  product: DrCocoProduct,
  quantity = 1
): Ga4Item {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: "Dr.Coco",
    item_category: "Woda kokosowa",
    price: toMoney(product.priceInCents),
    quantity,
  };
}

export function pushEcommerceEvent(
  event: string,
  ecommerce: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  // Clear previous ecommerce object so GA4 does not reuse stale item data.
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce });
}

// ── Consent ────────────────────────────────────────────

export function hasMarketingConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent === "accepted" || consent === null;
}

export function updateGoogleConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;

  const value = accepted ? "granted" : "denied";

  window.gtag?.("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

// ── Event Tracking ────────────────────────────────────

export function trackViewItem(product: DrCocoProduct): void {
  pushEcommerceEvent("view_item", {
    currency: "PLN",
    value: toMoney(product.priceInCents),
    items: [mapProductToGa4Item(product, 1)],
  });
}

export function trackAddToCart(product: DrCocoProduct, quantity = 1): void {
  pushEcommerceEvent("add_to_cart", {
    currency: "PLN",
    value: toMoney(product.priceInCents * quantity),
    items: [mapProductToGa4Item(product, quantity)],
  });
}

export function trackViewCart(items: DrCocoCartItem[]): void {
  if (!items.length) return;

  pushEcommerceEvent("view_cart", {
    currency: "PLN",
    value: cartValue(items),
    items: items.map((item) => mapProductToGa4Item(item, item.quantity)),
  });
}

export function trackBeginCheckout(items: DrCocoCartItem[]): void {
  if (!items.length) return;

  pushEcommerceEvent("begin_checkout", {
    currency: "PLN",
    value: cartValue(items),
    items: items.map((item) => mapProductToGa4Item(item, item.quantity)),
  });
}

export function trackPurchase(order: DrCocoOrder): void {
  pushEcommerceEvent("purchase", {
    transaction_id: order.id,
    currency: "PLN",
    value: toMoney(order.totalGross),
    tax: order.taxValue == null ? undefined : toMoney(order.taxValue),
    shipping:
      order.shippingGross == null ? undefined : toMoney(order.shippingGross),
    items: order.items.map((item) => ({
      item_id: item.productId,
      item_name: item.productName,
      item_brand: "Dr.Coco",
      item_category: "Woda kokosowa",
      price: toMoney(item.unitPriceGross),
      quantity: item.quantity,
    })),
  });
}
