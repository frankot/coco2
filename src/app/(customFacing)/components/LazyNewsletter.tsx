"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Newsletter = dynamic(() => import("./Newsletter").then((mod) => mod.Newsletter), {
  ssr: false,
  loading: () => <div className="min-h-[520px] bg-primary" aria-hidden="true" />,
});

export function LazyNewsletter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <Newsletter />
      ) : (
        <div className="min-h-[520px] bg-primary" aria-hidden="true" />
      )}
    </div>
  );
}
