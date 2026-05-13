"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

// Carousel slide data
const carouselSlides = [
  {
    id: 1,
    title: "Naturalna woda kokosowa",
    subtitle: "Z młodych kokosów",
    description: "Z młodych, zielonych kokosów, bez zbędnych dodatków",
    ctaText: "Odkryj teraz",
    image: "/hero/slide01.webp",
  },
  {
    id: 2,
    title: "Zadbaj o nawodnienie",
    subtitle: "Poczuj smak",
    description: "Nie tylko podzczas upalnych dni",
    ctaText: "Zamów teraz",
    image: "/hero/slide02.webp",
  },
  {
    id: 3,
    title: "Energia z natury",
    subtitle: "Naturalne paliwo",
    description:
      "Naturalne elektrolity sprawiają, że woda kokosowa świetnie sprawdza się na co dzień i po treningu",
    ctaText: "Poznaj więcej",
    image: "/hero/slide03.webp",
  },
  {
    id: 4,
    title: "Prosto z tropików",
    subtitle: "Naturalnie słodka",
    description: "Poczuj smak Tajlandii w każdym łyku",
    ctaText: "Dla dzieci",
    image: "/hero/slide04.webp",
  },
  {
    id: 5,
    title: "Dzieci ją uwielbiają",
    subtitle: "Każdego dnia",
    description: "Naturalnie słodka alternatywa dla soków",
    ctaText: "Czytaj więcej",
    image: "/hero/slide05.webp",
  },
];

interface HeroClientProps {
  products: any[];
}

export function HeroClient({ products }: HeroClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Auto-play with resettable timer
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  // Arrow visibility timer
  useEffect(() => {
    if (!showArrows) return;

    const timer = setTimeout(() => {
      setShowArrows(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showArrows]);

  const handleSlideAreaClick = () => {
    setShowArrows(true);
  };

  // Manual navigation — resets auto-play timer
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setShowArrows(true);
    startAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setShowArrows(true);
    startAutoPlay();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setShowArrows(true);
    startAutoPlay();
  };

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section className="relative h-[20rem] mt-0 lg:h-[35rem] lg:mt-[72px] w-full overflow-hidden">
      {/* Carousel Container */}
      <div
        className="relative h-full w-full"
        onClick={handleSlideAreaClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselSlides.map((slide, index) => {
            // 4th slide (index 3) should be left-aligned
            const isLeftAligned = index % 2 === 0 || index === 3;
            return (
            <div key={slide.id} className="min-w-full h-full relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  className={`object-cover ${index === 0 || index === 2 ? "object-right lg:object-center" : ""}`}
                  priority={index === 0}
                />
                {/* Overlay — gradient aligns with content side */}
                <div className={`absolute inset-0 ${
                  isLeftAligned
                    ? "bg-gradient-to-r from-black/80 md:from-black/60 via-black/30 to-black/10"
                    : "bg-gradient-to-l from-black/80 md:from-black/60 via-black/30 to-black/10"
                }`} />
              </div>

              {/* Content - Alternating positions */}
              <div className="relative z-10 h-full">
                <div className="container mx-auto px-6 lg:px-24 h-full">
                  <div
                    className={`h-full flex ${
                      isLeftAligned
                        ? "items-end justify-start pb-16 lg:pb-28"
                        : "items-start justify-end pt-24 lg:pt-28"
                    }`}
                  >
                    <div
                      className={`max-w-md lg:max-w-lg space-y-4 ${
                        isLeftAligned ? "text-left" : "text-right"
                      }`}
                    >
                      {/* Simple Badge */}
                      <div
                        className={`inline-flex items-center gap-1.5 text-white/80 text-xs font-medium tracking-wide uppercase ${
                          isLeftAligned ? "" : "flex-row-reverse"
                        }`}
                      >
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Dr.Coco</span>
                      </div>

                      {/* Minimal Title */}
                      <h1 className="text-3xl lg:text-5xl xl:text-6xl font-light text-white leading-tight tracking-tight">
                        {slide.title}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-lg lg:text-xl text-white/70 font-light leading-relaxed">
                        {slide.description}
                      </p>

                      {/* Minimal CTA */}
                      <div className="pt-2">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white hover:text-primary bg-transparent backdrop-blur-sm px-8 py-2.5 text-sm font-normal"
                        >
                          <Link href={slide.ctaText === "Zamów teraz" ? "/sklep" : "/nasza-historia"}>{slide.ctaText}</Link>
             
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Minimal Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
              }}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Minimal Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`hidden lg:flex absolute left-6 bottom-4 lg:top-1/2 lg:-translate-y-1/2 z-20 w-10 h-10 border border-white/30 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ${
            showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className={`hidden lg:flex absolute right-6 bottom-4 lg:top-1/2 lg:-translate-y-1/2 z-20 w-10 h-10 border border-white/30 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ${
            showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
