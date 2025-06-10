import { About } from "./components/About";
import { Hero2 } from "./components/Hero2";
import { InstaCaru } from "./components/InstaCaru2";
import FeaturedProducts from "./components/FeaturedProducts";
import Features from "./components/Features";
import LatestProductsSection from "./components/LatestProductsSection";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <div className="min-h-[200vh] flex flex-col overflow-x-hidden">
      <main>
{/* <LatestProductsSection/> */}
<Hero/>
        <Features />
        <About />
        <FeaturedProducts />
        <InstaCaru />
      </main>
    </div>
  );
}
