"use client";

import Image from "next/image";
import { useState } from "react";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export default function CloudinaryImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  priority = false,
  quality = 80,
  objectFit = "cover",
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is a Cloudinary URL
  const isCloudinaryUrl = src && src.includes("cloudinary.com");

  // For Cloudinary images, optimize the URL with transformation parameters
  const optimizedSrc = isCloudinaryUrl
    ? src.replace(
        "/upload/",
        `/upload/q_${quality},f_auto,c_${
          objectFit === "contain" ? "pad" : objectFit
        }/`
      )
    : src;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: width / height }}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={isCloudinaryUrl ? undefined : quality} // Let Cloudinary handle quality if it's a Cloudinary URL
        className={`
          transition-all duration-300
          ${objectFit === "contain" ? "object-contain" : "object-cover"}
          ${isLoading ? "scale-110 blur-sm" : "scale-100 blur-0"}
        `}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}
