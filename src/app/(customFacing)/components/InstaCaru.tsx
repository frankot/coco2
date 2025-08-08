"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// List of Dr.Coco Instagram posts to display
const INSTAGRAM_POSTS = [
  {
    id: "DJjJ0R_RRbv",
    imageUrl: "/insta/post1.jpg",
    postUrl: "https://www.instagram.com/p/DJjJ0R_RRbv/",
    caption: "Orzeźwienie w czystej postaci! 🥥 #DrCoco #WodaKokosowa",
  },
  {
    id: "C7EXCpMR2K_",
    imageUrl: "/insta/post2.jpg",
    postUrl: "https://www.instagram.com/p/C7EXCpMR2K_/",
    caption: "Idealne na lato! Naturalna woda kokosowa Dr.Coco 🏖️ #ZdroweNawodnienie",
  },
  {
    id: "C6qKpyLR9_B",
    imageUrl: "/insta/post3.jpg",
    postUrl: "https://www.instagram.com/p/C6qKpyLR9_B/",
    caption: "Elektrolity w naturalnej formie. Twój organizm Ci podziękuje! 💪 #DrCoco",
  },
  {
    id: "C6dPgxYRZHn",
    imageUrl: "/insta/post4.jpg",
    postUrl: "https://www.instagram.com/p/C6dPgxYRZHn/",
    caption: "Dr.Coco - zawsze pod ręką gdy potrzebujesz nawodnienia! 🥥 #CocoDrink",
  },
  {
    id: "C6YFyGtxlQR",
    imageUrl: "/insta/post5.jpg",
    postUrl: "https://www.instagram.com/p/C6YFyGtxlQR/",
    caption: "Tylko naturalne składniki. Zero dodatków. 100% natury! 🌱 #EkoNapój",
  },
  {
    id: "C5_kCgQRxtA",
    imageUrl: "/insta/post6.jpg",
    postUrl: "https://www.instagram.com/p/C5_kCgQRxtA/",
    caption: "Trening zakończony! Czas na regenerację z Dr.Coco 🏋️‍♂️ #FitLife",
  },
  {
    id: "C5ypv3dR3Zw",
    imageUrl: "/insta/post7.jpg",
    postUrl: "https://www.instagram.com/p/C5ypv3dR3Zw/",
    caption: "Najpopularniejszy napój na naszych stoiskach! 🥥 #DrCoco #BestSeller",
  },
  {
    id: "C5gfm-RRIhz",
    imageUrl: "/insta/post8.jpg",
    postUrl: "https://www.instagram.com/p/C5gfm-RRIhz/",
    caption: "Nowy sklep, to samo orzeźwienie! Sprawdź gdzie można nas znaleźć 🛒 #DrCocoShop",
  },
];

/**
 * Truncate caption text to specified length
 */
function truncateCaption(text: string, maxLength: number = 60): string {
  return text.length > maxLength ? text.substring(0, maxLength).trim() + "..." : text;
}

export function InstaCaru() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Set up the infinite scrolling animation
//   useEffect(() => {
//     if (!carouselRef.current) return;

//     // Basic scroll animation
//     const carousel = carouselRef.current;

//     const scrollCarousel = () => {
//       if (!carousel) return;

//       if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
//         carousel.scrollLeft = 0; // Reset to start when reaching the duplicate set
//       } else {
//         carousel.scrollLeft += 1; // Slow scroll
//       }
//     };

//     // Set intervals for slow scrolling
//     const scrollInterval = setInterval(scrollCarousel, 30);

//     // Clean up interval on unmount
//     return () => clearInterval(scrollInterval);
//   }, []);

  return (
    <section className="py-10 bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* Instagram Carousel */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent " />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent " />

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-4"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            {/* Duplicate posts for infinite scrolling effect */}
            {[...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS].map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="insta-card flex-shrink-0 w-72 rounded-lg overflow-hidden bg-card border shadow-sm"
              >
                {/* Instagram post image */}
                <div className="relative h-72 w-72">
                  <Image
                    src={post.imageUrl}
                    alt={truncateCaption(post.caption, 20)}
                    fill
                    sizes="(max-width: 768px) 100vw, 288px"
                    className="object-cover"
                  />
                </div>

                {/* Post details */}
                <div className="p-4">
                  <p className="text-sm mb-3">{truncateCaption(post.caption)}</p>

                  <Link
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Zobacz na Instagramie
                  </Link>
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
