export const META_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1000819192705453";
export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookieConsentChanged";

type MetaPixelParams = Record<string, string | number | boolean | string[] | number[] | undefined>;
type MetaPixelFunction = ((command: string, event: string, params?: MetaPixelParams) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    __metaPixelInitialized?: boolean;
  }
}

export function hasMarketingConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export function initMetaPixel() {
  if (typeof window === "undefined" || !META_PIXEL_ID || !hasMarketingConsent()) return false;
  if (window.__metaPixelInitialized) return true;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue?.push(args);
      }
    } as MetaPixelFunction;

    window.fbq = fbq;
    window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript) || document.head.appendChild(script);
  }

  window.fbq?.("init", META_PIXEL_ID);
  window.__metaPixelInitialized = true;
  return true;
}

export function trackMetaPixelEvent(event: string, params?: MetaPixelParams) {
  if (!initMetaPixel()) return false;
  window.fbq?.("track", event, params);
  return true;
}

export function trackMetaPixelPageView() {
  return trackMetaPixelEvent("PageView");
}
