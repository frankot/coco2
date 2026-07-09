"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  hasMarketingConsent,
  trackMetaPixelPageView,
} from "@/lib/meta-pixel";

export function MetaPixel() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => setEnabled(hasMarketingConsent());
    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    window.addEventListener("storage", syncConsent);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    trackMetaPixelPageView();
  }, [enabled, pathname]);

  return null;
}
