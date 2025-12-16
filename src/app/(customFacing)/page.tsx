import { About } from "./components/About";
import { InstagramFeed } from "./components/InstagramFeed";
import Features from "./components/Features";
import { Hero } from "./components/Hero";
import { Newsletter } from "./components/Newsletter";
import { FeaturedArticles } from "./components/FeaturedArticles";
import { BackgroundWrapper } from "./components/BackgroundWrapper";
import FeaturedProducts from "./components/FeaturedProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr.Coco - Naturalna woda kokosowa z Wietnamu",
  description:
    "Dr.Coco to naturalna woda kokosowa z młodych kokosów. Zdrowa alternatywa dla napojów izotonicznych. Bez cukru, bez konserwantów, produkt wegański.",
  keywords: [
    "woda kokosowa",
    "Dr.Coco",
    "naturalny izotonik",
    "zdrowe napoje",
    "woda kokosowa Wietnam",
  ],
};

export default function Home() {
  return (
    <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
      <main>
        <Hero />

        <FeaturedProducts />
        <About />

        <FeaturedArticles />
        <InstagramFeed />

        <Features />

        <Newsletter />
      </main>
    </div>
  );
}
