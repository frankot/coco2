"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";

const DeferredToaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function LazyToaster() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;

    const win = window as IdleWindow;
    const mount = () => setShouldMount(true);
    const events = ["pointerdown", "keydown", "touchstart", "focusin"];

    events.forEach((event) => window.addEventListener(event, mount, { once: true, passive: true }));

    const idleId = win.requestIdleCallback
      ? win.requestIdleCallback(mount, { timeout: 2500 })
      : window.setTimeout(mount, 2500);

    return () => {
      events.forEach((event) => window.removeEventListener(event, mount));
      if (win.cancelIdleCallback && typeof idleId === "number") {
        win.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [shouldMount]);

  if (!shouldMount) return null;

  return (
    <DeferredToaster
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      theme="light"
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-border": "1px solid hsl(var(--primary))",
          "--normal-text": "hsl(var(--foreground))",
        } as CSSProperties
      }
    />
  );
}
