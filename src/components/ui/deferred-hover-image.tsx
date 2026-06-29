"use client";

import { useState } from "react";
import Image from "next/image";

interface DeferredHoverImageProps {
  src: string;
  alt: string;
  sizes: string;
  className: string;
}

export function DeferredHoverImage({ src, alt, sizes, className }: DeferredHoverImageProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePointerEnter = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setShouldRender(true);
  };

  return (
    <div className="absolute inset-0" onPointerEnter={handlePointerEnter}>
      {shouldRender && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`${className} ${isLoaded ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
