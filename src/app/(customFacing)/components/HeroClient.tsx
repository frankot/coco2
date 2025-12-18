"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

// Carousel slide data
const carouselSlides = [
  {
    id: 1,
    title: "Naturalna Woda Kokosowa",
    subtitle: "Dr.Coco",
    description:
      "Czyste źródło natury - nic dodanego, nic odjętego. Wydobywamy ją bezpośrednio z młodych, zielonych kokosów.",
    ctaText: "Odkryj teraz",
    image: "/hero/slide0.webp",
  },
  {
    id: 2,
    title: "Tropikalne Doznania",
    subtitle: "W każdym łyku",
    description:
      "Poczuj smak tropików w każdym łyku. Naturalnie słodka, orzeźwiająca woda kokosowa prosto z palm.",
    ctaText: "Zamów teraz",
    image: "/hero/slide1.webp",
  },
  {
    id: 3,
    title: "Zdrowa Energia",
    subtitle: "Naturalne paliwo",
    description:
      "Trójglicerydy średniołańcuchowe (MCT) zapewniają czystą, długotrwałą energię bez skoków cukru.",
    ctaText: "Poznaj więcej",
    image: "/hero/slide2.webp",
  },
];

interface HeroClientProps {
  products: any[];
}

export function HeroClient({ products }: HeroClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setShowArrows(true);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setShowArrows(true);
  };

  return (
    <section className="relative h-[40rem] lg:mt-14 w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-full w-full" onClick={handleSlideAreaClick}>
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselSlides.map((slide, index) => (
            <div key={slide.id} className="min-w-full h-full relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Overlay - lighter for minimalism */}
                <div className={`absolute inset-0 bg-gradient-to-br from-black/40 to-black/20`} />
              </div>

              {/* Content - Alternating positions */}
              <div className="relative z-10 h-full">
                <div className="container mx-auto px-6 lg:px-12 h-full">
                  <div
                    className={`h-full flex ${
                      index % 2 === 0
                        ? "items-end justify-start pb-16 lg:pb-20"
                        : "items-start justify-end pt-24 lg:pt-28"
                    }`}
                  >
                    <div
                      className={`max-w-md lg:max-w-lg space-y-4 ${
                        index % 2 === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {/* Simple Badge */}
                      <div
                        className={`inline-flex items-center gap-1.5 text-white/80 text-xs font-medium tracking-wide uppercase ${
                          index % 2 === 0 ? "" : "flex-row-reverse"
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
                          {slide.ctaText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setShowArrows(true);
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
          className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 border border-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ${
            showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 border border-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ${
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
