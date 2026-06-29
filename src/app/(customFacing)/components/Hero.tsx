import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarouselControls } from "./HeroCarouselControls";
import { carouselSlides, isSlideLeftAligned } from "./heroSlides";

export function Hero() {
  return (
    <section className="relative h-[20rem] mt-0 lg:h-[35rem] lg:mt-[72px] w-full overflow-hidden">
      <div className="relative h-full w-full" data-hero-slide-area>
        <div className="flex h-full transition-transform duration-700 ease-in-out" data-hero-track>
          {carouselSlides.map((slide, index) => {
            const isLeftAligned = isSlideLeftAligned(index);
            const Title = index === 0 ? "h1" : "h2";

            return (
              <div key={slide.id} className="min-w-full h-full relative">
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    className={`object-cover ${index === 0 || index === 2 ? "object-right lg:object-center" : ""}`}
                    preload={index === 0}
                  />
                  <div
                    className={`absolute inset-0 ${
                      isLeftAligned
                        ? "bg-gradient-to-r from-black/80 md:from-black/60 via-black/30 to-black/10"
                        : "bg-gradient-to-l from-black/80 md:from-black/60 via-black/30 to-black/10"
                    }`}
                  />
                </div>

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
                        <div
                          className={`inline-flex items-center gap-1.5 text-white/80 text-xs font-medium tracking-wide uppercase ${
                            isLeftAligned ? "" : "flex-row-reverse"
                          }`}
                        >
                          <Leaf className="w-3.5 h-3.5" />
                          <span>Dr.Coco</span>
                        </div>

                        <Title className="text-3xl lg:text-5xl xl:text-6xl font-light text-white leading-tight tracking-tight">
                          {slide.title}
                        </Title>

                        <p className="text-lg lg:text-xl text-white/70 font-light leading-relaxed">
                          {slide.description}
                        </p>

                        <div className="pt-2">
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white hover:text-primary bg-transparent backdrop-blur-sm px-8 py-2.5 text-sm font-normal"
                          >
                            <Link
                              href={slide.ctaText === "Zamów teraz" ? "/sklep" : "/nasza-historia"}
                              aria-label={`${slide.ctaText}: ${slide.title}`}
                            >
                              {slide.ctaText}
                            </Link>
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

        <HeroCarouselControls />
      </div>
    </section>
  );
}
