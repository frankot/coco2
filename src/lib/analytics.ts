// Analytics — GTM dataLayer helpers + cookie consent
// Hard-coded for Dr.Coco (GTM-MQ3CND2M → GA4 G-N3N1V1116L)

export const GTM_ID = "GTM-MQ3CND2M";
export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookieConsentChanged";
export const PAYMENT_CONFIRMED_EVENT = "paymentConfirmed";

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

export type DrCocoOrderItem = {
  productId: string;
  productName: string;
  unitPriceGross: number; // in cents
  quantity: number;
};

export type DrCocoOrder = {
  id: string;
  shippingGross?: number; // in cents
  discountGross?: number; // in cents
  coupon?: string;
  items: DrCocoOrderItem[];
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
  return Math.round(valueInCents) / 100;
}

function cartValue(items: DrCocoCartItem[]): number {
  return toMoney(
    items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0)
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

// Self-healing gtag shim — the layout script defines window.gtag, but never
// let a missing shim silently swallow a consent update.
function ensureGtag(): (...args: unknown[]) => void {
  const layer = (window.dataLayer = window.dataLayer || []);
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      // gtag() pushes the raw `arguments` object — GTM relies on that shape
      // eslint-disable-next-line prefer-rest-params
      layer.push(arguments as unknown as Record<string, unknown>);
    };
  }
  return window.gtag;
}

export function hasMarketingConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

// Mirrors the denied-by-default consent state: no explicit choice means no consent.
export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export function updateGoogleConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;

  const value = accepted ? "granted" : "denied";

  ensureGtag()("consent", "update", {
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

// purchase must fire once per order, for good — localStorage survives reloads,
// back-navigation and a later visit from the confirmation e-mail link.
function claimPurchaseOnce(orderId: string): boolean {
  const key = `ga4_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

export function trackPurchase(order: DrCocoOrder): void {
  if (!claimPurchaseOnce(order.id)) return;

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.unitPriceGross * item.quantity,
    0
  );
  // GA4: value is the items total minus discount — shipping is a separate param
  const value = Math.max(0, itemsTotal - (order.discountGross || 0));

  pushEcommerceEvent("purchase", {
    transaction_id: order.id,
    currency: "PLN",
    value: toMoney(value),
    ...(order.shippingGross == null
      ? {}
      : { shipping: toMoney(order.shippingGross) }),
    ...(order.discountGross ? { discount: toMoney(order.discountGross) } : {}),
    ...(order.coupon ? { coupon: order.coupon } : {}),
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
