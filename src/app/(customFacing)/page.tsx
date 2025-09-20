import { About } from "./components/About";
import { InstaCaru } from "./components/InstaCaru2";
import Features from "./components/Features";
import { Hero } from "./components/Hero";
import { Newsletter } from "./components/Newsletter";
import { FeaturedArticles } from "./components/FeaturedArticles";
import { BackgroundWrapper } from "./components/BackgroundWrapper";
import FeaturedProducts from "./components/FeaturedProducts";

export default function Home() {
  return (
    <BackgroundWrapper>
      <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
        <main>
          <Hero />
    
          <FeaturedProducts />
          <About />

          <FeaturedArticles />
          <InstaCaru />

          <Features />

          <Newsletter />
        </main>
      </div>
    </BackgroundWrapper>
  );
}
