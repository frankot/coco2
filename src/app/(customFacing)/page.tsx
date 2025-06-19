import { About } from "./components/About";
import { InstaCaru } from "./components/InstaCaru2";
import Features from "./components/Features";
import { Hero } from "./components/Hero";
import { Faq } from "@/app/(customFacing)/components/Faq";
import { Hero2 } from "./components/Hero2";
import { Newsletter } from "./components/Newsletter";
import { FeaturedArticles } from "./components/FeaturedArticles";

export default function Home() {
  return (
    <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
      <main>
        {/* <LatestProductsSection/> */}
        <Hero />
        <Hero2 />
        <About />
        <FeaturedArticles />

        <Faq />
        <InstaCaru />
        <Features />

        <Newsletter />

      </main>
    </div>
  );
}
