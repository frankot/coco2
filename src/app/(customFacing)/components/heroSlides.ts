export const carouselSlides = [
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

export function isSlideLeftAligned(index: number) {
  return index % 2 === 0 || index === 3;
}
