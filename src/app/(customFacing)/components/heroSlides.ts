type SlideImage = { src: string; width: number; height: number };

export type ContentSlide = {
  kind: "content";
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  href: string;
  image: string;
  align: "left" | "right";
  imageClassName?: string;
};

export type PromoSlide = {
  kind: "promo";
  id: number;
  title: string;
  alt: string;
  href: string;
  desktopImage: SlideImage;
  mobileImage: SlideImage;
};

export type HeroSlide = ContentSlide | PromoSlide;

export const carouselSlides: HeroSlide[] = [
  {
    kind: "promo",
    id: 0,
    title: "Black Week -15%",
    alt: "Black Week: -15% na cały asortyment z kodem BLACKWEEK15",
    href: "/sklep",
    desktopImage: { src: "/hero/black-week-desktop.webp", width: 3840, height: 1500 },
    mobileImage: { src: "/hero/black-week-mobile.webp", width: 1170, height: 960 },
  },
  {
    kind: "content",
    id: 1,
    title: "Naturalna woda kokosowa",
    subtitle: "Z młodych kokosów",
    description: "Z młodych, zielonych kokosów, bez zbędnych dodatków",
    ctaText: "Odkryj teraz",
    href: "/nasza-historia",
    image: "/hero/slide01.webp",
    align: "left",
    imageClassName: "object-right lg:object-center",
  },
  {
    kind: "content",
    id: 2,
    title: "Zadbaj o nawodnienie",
    subtitle: "Poczuj smak",
    description: "Nie tylko podzczas upalnych dni",
    ctaText: "Zamów teraz",
    href: "/sklep",
    image: "/hero/slide02.webp",
    align: "right",
  },
  {
    kind: "content",
    id: 3,
    title: "Energia z natury",
    subtitle: "Naturalne paliwo",
    description:
      "Naturalne elektrolity sprawiają, że woda kokosowa świetnie sprawdza się na co dzień i po treningu",
    ctaText: "Poznaj więcej",
    href: "/nasza-historia",
    image: "/hero/slide03.webp",
    align: "left",
    imageClassName: "object-right lg:object-center",
  },
  {
    kind: "content",
    id: 4,
    title: "Prosto z tropików",
    subtitle: "Naturalnie słodka",
    description: "Poczuj smak Tajlandii w każdym łyku",
    ctaText: "Dla dzieci",
    href: "/nasza-historia",
    image: "/hero/slide04.webp",
    align: "left",
  },
  {
    kind: "content",
    id: 5,
    title: "Dzieci ją uwielbiają",
    subtitle: "Każdego dnia",
    description: "Naturalnie słodka alternatywa dla soków",
    ctaText: "Czytaj więcej",
    href: "/nasza-historia",
    image: "/hero/slide05.webp",
    align: "left",
  },
];
