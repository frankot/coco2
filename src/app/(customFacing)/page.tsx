import { About } from "./components/About";
import Features from "./components/Features";
import { Hero } from "./components/Hero";
import { Newsletter } from "./components/Newsletter";
import { FeaturedArticles } from "./components/FeaturedArticles";
import FeaturedProducts from "./components/FeaturedProducts";
import type { Metadata } from "next";
import { Faq } from "./components/Faq";

export const metadata: Metadata = {
  title: "Dr.Coco - Naturalna woda kokosowa z Wietnamu",
  description:
    "Dr.Coco® to naturalna woda kokosowa z młodych kokosów z organicznych farm w Wietnamie. Naturalny izotonik bez cukru, bez konserwantów, wegański i bezglutenowy. Zamów online.",
  keywords: [
    "woda kokosowa",
    "Dr.Coco",
    "naturalny izotonik",
    "zdrowe napoje",
    "woda kokosowa Wietnam",
    "napój kokosowy",
    "woda z młodych kokosów",
  ],
  alternates: {
    canonical: "https://drcoco.pl",
  },
  openGraph: {
    title: "Dr.Coco - Naturalna woda kokosowa z Wietnamu",
    description:
      "Naturalny izotonik z organicznych farm w Wietnamie. Bez cukru, bez konserwantów, wegański i bezglutenowy.",
    url: "https://drcoco.pl",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Dr.Coco - Naturalna woda kokosowa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr.Coco - Naturalna woda kokosowa z Wietnamu",
    description:
      "Naturalny izotonik z organicznych farm w Wietnamie. Bez cukru, bez konserwantów, wegański.",
    images: ["/og-image.webp"],
  },
};

export default function Home() {
  return (
    <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
      <main>
        <Hero />

        <FeaturedProducts />
        <About />

        <FeaturedArticles />
        <Faq/>

        <Features />

        <Newsletter />

      </main>
    </div>
  );
}
