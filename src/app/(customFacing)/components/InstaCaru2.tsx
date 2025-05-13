"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// List of images from public/ig directory
const IG_IMAGES = [
  "/ig/IMG_4502.webp",
  "/ig/IMG_4503.webp",
  "/ig/IMG_4504.webp",
  "/ig/IMG_4505.webp",
  "/ig/IMG_4506.webp",
  "/ig/IMG_4507.webp",
  "/ig/IMG_4508.webp",
  "/ig/IMG_4509.webp",
  "/ig/IMG_4510.webp",
  "/ig/IMG_4511.webp",
  "/ig/IMG_4512.webp",
  "/ig/IMG_4513.webp",
  "/ig/IMG_4514.webp",
  "/ig/IMG_4515.webp",
  "/ig/IMG_4516.webp",
  "/ig/IMG_4517.webp",
  "/ig/IMG_4518.webp",
  "/ig/IMG_4519.webp",
];

export function InstaCaru() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const scrollSpeed = 0.5; // pixels per animation frame

  // Set up automatic scrolling when not hovering
  useEffect(() => {
    if (!carouselRef.current) return;

    let animationId: number;
    const carousel = carouselRef.current;

    const scroll = () => {
      if (!carousel || isHovering) return;

      // Increment scroll position
      carousel.scrollLeft += scrollSpeed;

      // Reset scroll position when reaching the end of first set of images
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        carousel.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(scroll);

    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovering]);

  return (
    <section className="py-10 bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* Instagram Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent " />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent " />

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-4"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            {/* Display images from public/ig directory */}
            {[...IG_IMAGES, ...IG_IMAGES].map((imgSrc, index) => (
              <div
                key={`${imgSrc}-${index}`}
                className="insta-card flex-shrink-0 w-60 rounded-lg overflow-hidden bg-card border shadow-sm group"
              >
                {/* Image with 9:16 aspect ratio */}
                <div className="relative h-[427px] w-60">
                  <Image
                    src={imgSrc}
                    alt={`Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover"
                  />
                  {/* Primary color blur overlay that disappears on hover */}
                  <div
                    className="absolute inset-0 bg-primary/30 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    aria-hidden="true"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="https://www.instagram.com/dr.coco/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center justify-center gap-2"
          >
            Zobacz więcej na Instagramie
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
