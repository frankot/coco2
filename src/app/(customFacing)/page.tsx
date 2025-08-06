import { About } from "./components/About";
import { InstaCaru } from "./components/InstaCaru2";
import Features from "./components/Features";
import { Hero } from "./components/Hero";
import { Faq } from "@/app/(customFacing)/components/Faq";
import { Hero2 } from "./components/Hero2";
import { Newsletter } from "./components/Newsletter";
import { FeaturedArticles } from "./components/FeaturedArticles";
import Hero3 from "./components/Hero3";
import { BackgroundWrapper } from "./components/BackgroundWrapper";

export default function Home() {
  return (
    <BackgroundWrapper>
      <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
        <main>
          {/* <Hero3 />
          <Hero2 /> */}
          <Hero/>
          <About />
          <Faq />
          <FeaturedArticles />

          <InstaCaru />
          <Features />
          <Newsletter />
        </main>
      </div>
    </BackgroundWrapper>
  );
}
