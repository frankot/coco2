"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlides } from "./heroSlides";

const minSwipeDistance = 50;

export function HeroCarouselControls() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setShowArrows(true);
    startAutoPlay();
  }, [startAutoPlay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setShowArrows(true);
    startAutoPlay();
  }, [startAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setShowArrows(true);
    startAutoPlay();
  };

  useEffect(() => {
    const track = document.querySelector<HTMLElement>("[data-hero-track]");
    if (!track) return;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, [currentSlide]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  useEffect(() => {
    if (!showArrows) return;

    const timer = setTimeout(() => {
      setShowArrows(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showArrows]);

  useEffect(() => {
    const slideArea = document.querySelector<HTMLElement>("[data-hero-slide-area]");
    if (!slideArea) return;

    const handleSlideAreaClick = () => {
      setShowArrows(true);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchEndRef.current = null;
      touchStartRef.current = event.targetTouches[0]?.clientX ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      touchEndRef.current = event.targetTouches[0]?.clientX ?? null;
    };

    const onTouchEnd = () => {
      if (!touchStartRef.current || !touchEndRef.current) return;
      const distance = touchStartRef.current - touchEndRef.current;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        nextSlide();
      } else if (isRightSwipe) {
        prevSlide();
      }
    };

    slideArea.addEventListener("click", handleSlideAreaClick);
    slideArea.addEventListener("touchstart", onTouchStart, { passive: true });
    slideArea.addEventListener("touchmove", onTouchMove, { passive: true });
    slideArea.addEventListener("touchend", onTouchEnd);

    return () => {
      slideArea.removeEventListener("click", handleSlideAreaClick);
      slideArea.removeEventListener("touchstart", onTouchStart);
      slideArea.removeEventListener("touchmove", onTouchMove);
      slideArea.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  return (
    <>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              goToSlide(index);
            }}
            className="min-h-12 min-w-12 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Przejdź do slajdu ${index + 1}: ${carouselSlides[index].title}`}
            aria-current={index === currentSlide ? "true" : undefined}
          >
            <span
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className={`hidden lg:flex absolute left-6 bottom-4 lg:top-1/2 lg:-translate-y-1/2 z-20 w-12 h-12 border border-white/30 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        aria-label="Poprzedni slajd"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className={`hidden lg:flex absolute right-6 bottom-4 lg:top-1/2 lg:-translate-y-1/2 z-20 w-12 h-12 border border-white/30 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        aria-label="Następny slajd"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}
