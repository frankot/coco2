import Image from "next/image";
import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Nasza historia",
  description:
    "Poznaj historię Dr Coco — jak jedna chwila w Azji Południowo-Wschodniej stała się początkiem marki, która chce zachować to, co najprostsze.",
  alternates: {
    canonical: "https://drcoco.pl/nasza-historia",
  },
  openGraph: {
    title: "Nasza historia | Dr.Coco",
    description: "Jak jedna chwila w Azji Południowo-Wschodniej stała się początkiem Dr Coco.",
    url: "https://drcoco.pl/nasza-historia",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Nasza historia Dr.Coco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nasza historia | Dr.Coco",
    description: "Jak jedna chwila w Azji Południowo-Wschodniej stała się początkiem Dr Coco.",
    images: ["/og-image.webp"],
  },
};

export default function NaszaHistoriaPage() {
  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader accent="Nasza historia" subtitle="Nie wszystko zaczyna się od planu." />

        {/* Hero Story Block */}
        <div className="relative mb-16">
          <Image
            src="https://images.unsplash.com/photo-1603779046675-2eccbab9b982?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Łódź z kokosami o zachodzie słońca"
            width={500}
            height={650}
            className="hidden lg:block float-right ml-10 mb-6 w-[44%] h-auto object-cover rounded-2xl shadow-lg"
          />

          {/* Mobile Image */}
          <div className="lg:hidden mb-8">
            <Image
              src="/about1."
              alt="Łódź z kokosami o zachodzie słońca"
              width={800}
              height={500}
              className="w-full h-[340px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
            <p>Niektóre rzeczy zaczynają się od momentu, którego nie da się zaplanować.</p>
            <p>
              Podczas podróży po Azji Południowo-Wschodniej, z dala od rytmu codzienności, pojawił
              się obraz, który do dziś jest początkiem Dr Coco.
            </p>

            {/* Scene */}
            <div className="border-l-4 border-primary pl-5 space-y-1 text-gray-600 italic">
              <p>Spokojna woda.</p>
              <p>Zachodzące słońce.</p>
              <p>Łódź wypełniona kokosami.</p>
            </div>

            <p>
              I myśl — prosta, ale bardzo konkretna:{" "}
              <strong className="text-gray-900">ten smak powinien istnieć wszędzie.</strong>
            </p>
            <p>Nie jako interpretacja. Nie jako wersja „pod rynek". Jako coś prawdziwego.</p>
          </div>
        </div>

        {/* Journey Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left - Image */}
          <div>
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Plantacja kokosów"
              width={600}
              height={700}
              className="w-full h-[420px] lg:h-[540px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right - Text */}
          <div className="space-y-6 text-gray-700 leading-relaxed text-base lg:text-lg">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Z tej jednej chwili zaczęła się droga.
            </h2>
            <p>
              Rozmowy z ludźmi, którzy znają kokosy od pokoleń. Czas spędzony na plantacjach.
              Dziesiątki prób i decyzji, które nie zawsze były oczywiste.
            </p>
            <p>Ale kierunek od początku był jeden: zachować to, co najprostsze.</p>
            <p>
              Dr Coco powstało z potrzeby jakości, nie z potrzeby produktu. To różnica, którą czuć
              od pierwszego łyku.
            </p>
            <p className="text-primary font-semibold text-lg lg:text-xl">
              Straight from the tropics.
            </p>
          </div>
        </div>

        {/* Bottom Image Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          <Image
            src="https://images.unsplash.com/photo-1627502713399-e53b56a7a0b0?w=600&q=80"
            alt="Młode kokosy"
            width={600}
            height={400}
            className="w-full h-52 object-cover rounded-xl shadow-sm"
          />
          <Image
            src="https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80"
            alt="Tropikalna plaża"
            width={600}
            height={400}
            className="w-full h-52 object-cover rounded-xl shadow-sm"
          />
          <Image
            src="https://images.unsplash.com/photo-1597302711628-99b1e84af3b7?w=600&q=80"
            alt="Woda kokosowa"
            width={600}
            height={400}
            className="w-full h-52 object-cover rounded-xl shadow-sm col-span-2 lg:col-span-1"
          />
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Przekonaj się sam, co to znaczy prawdziwy smak
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Każdy łyk Dr Coco to efekt tej jednej chwili — i wszystkich decyzji, które po niej
            nastąpiły.
          </p>
          <a
            href="/sklep"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-colors"
          >
            Zobacz produkty
          </a>
        </div>
      </div>
    </div>
  );
}
