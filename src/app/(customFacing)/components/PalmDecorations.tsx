"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";

type PalmDecorationsProps = {
  hidden: boolean;
  hovering: boolean;
  scrollProgress: number;
};

// Memoize the component to avoid unnecessary re-renders
export const PalmDecorations = memo(function PalmDecorations({
  hidden,
  hovering,
  scrollProgress,
}: PalmDecorationsProps) {
  // Skip preloading logic which was causing issues
  // Just use Next.js Image with priority which handles preloading

  // Determine opacity based on state and scroll
  const opacity = hidden && !hovering ? 0 : scrollProgress;

  return (
    <div className="fixed inset-0 w-full pointer-events-none" style={{ height: "200vh" }}>
      {/* Right palm decoration */}
      <div
        className="absolute -right-40 -top-20 w-96 h-96 will-change-transform transition-all duration-1000 ease-out"
        style={{
          transform: `translateX(${scrollProgress * -100}px) translateY(${scrollProgress * 50}px) rotate(${scrollProgress * -15}deg)`,
          opacity,
        }}
      >
        <Image
          src="/palmy-prawa.png"
          alt="Palm decoration"
          width={600}
          height={600}
          className="object-contain"
          priority={true}
          loading="eager"
        />
      </div>

      {/* Left palm decoration (flipped version of the right one) */}
      <div
        className="absolute -left-40 -top-20 w-96 h-96 will-change-transform transition-all duration-1000 ease-out"
        style={{
          transform: `translateX(${scrollProgress * 100}px) translateY(${scrollProgress * 50}px) rotate(${scrollProgress * 15}deg) scaleX(-1)`,
          opacity,
        }}
      >
        <Image
          src="/palmy-prawa.png"
          alt="Palm decoration"
          width={600}
          height={600}
          className="object-contain"
          priority={true}
          loading="eager"
        />
      </div>
    </div>
  );
});
