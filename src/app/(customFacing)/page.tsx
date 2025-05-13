import { About } from "./components/About";
import { Hero } from "./components/Hero";
import { InstaCaru } from "./components/InstaCaru2";


export default function Home() {
  return (
    <div className="min-h-[200vh]  flex flex-col">
      <main>
        <Hero />
        <InstaCaru />
        <About />
      </main>
    </div>
  );
}
