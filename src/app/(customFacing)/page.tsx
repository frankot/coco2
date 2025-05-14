import { About } from "./components/About";
import { Hero } from "./components/Hero";
import { InstaCaru } from "./components/InstaCaru2";
import FeaturedProducts from "./components/FeaturedProducts";
import Features from "./components/Features";

export default function Home() {
  return (
    <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
      <main>
        <Hero />
        <Features />
        <About />
        <FeaturedProducts />
        <InstaCaru />
      </main>
    </div>
  );
}
