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
    <section className="relative h-[40rem] mt-14 w-full overflow-hidden">
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
                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/20`} />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                  <div className=" space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                      <Leaf className="w-4 h-4" />
                      Dr.Coco
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                      {slide.title}
                      <span className="block text-3xl lg:text-4xl xl:text-5xl">
                        {slide.subtitle}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-2 lg:p-6 border border-white/20 shadow-2xl">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div>
                      <Button
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold rounded-full"
                      >
                        {slide.ctaText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-all duration-300 group shadow-lg ${
            showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-all duration-300 group shadow-lg ${
            showArrows ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </section>
  );
}
