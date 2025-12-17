"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { InstagramPost } from "@/lib/instagram";

interface InstaCaruProps {
  posts: InstagramPost[];
}

export function InstaCaru({ posts }: InstaCaruProps) {
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

  // If no posts, show fallback message
  if (!posts || posts.length === 0) {
    return (
      <section className="py-10 pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>Brak postów z Instagrama do wyświetlenia.</p>
            <Link
              href="https://www.instagram.com/dr.coco/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-2 mt-4"
            >
              Odwiedź nasz Instagram
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 pt-32">
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
            {/* Duplicate posts array for infinite scroll effect */}
            {[...posts, ...posts].map((post, index) => {
              const imageUrl =
                post.media_type === "VIDEO" && post.thumbnail_url
                  ? post.thumbnail_url
                  : post.media_url;

              return (
                <Link
                  key={`${post.id}-${index}`}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-card flex-shrink-0 w-60 rounded-lg overflow-hidden bg-card border shadow-sm group"
                >
                  {/* Image with 9:16 aspect ratio */}
                  <div className="relative h-[427px] w-60">
                    <Image
                      src={imageUrl}
                      alt={post.caption?.substring(0, 100) || "Instagram post"}
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="object-cover"
                    />
                    {/* Primary color blur overlay that disappears on hover */}
                    <div
                      className="absolute inset-0 bg-primary/10 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                      aria-hidden="true"
                    ></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="https://www.instagram.com/dr.coco/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center justify-center gap-2 text-2xl"
          >
            Zobacz więcej na Instagramie
            <ExternalLink className="size-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
