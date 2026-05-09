import Image from "next/image";
import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Nasza historia",
  description:
    "Poznaj historię Dr.Coco® — jak podróż do Azji Południowo-Wschodniej zapoczątkowała markę, która od 2015 roku dostarcza do Polski najlepszą naturalną wodę kokosową.",
  alternates: {
    canonical: "https://drcoco.pl/nasza-historia",
  },
  openGraph: {
    title: "Nasza historia | Dr.Coco",
    description:
      "Poznaj historię Dr.Coco® — producenta najlepszej naturalnej wody kokosowej w Polsce.",
    url: "https://drcoco.pl/nasza-historia",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Dr.Coco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nasza historia | Dr.Coco",
    description:
      "Poznaj historię Dr.Coco® — producenta najlepszej naturalnej wody kokosowej w Polsce.",
    images: ["/og-image.webp"],
  },
};

export default function NaszaHistoriaPage() {
  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          accent="Nasza historia"
          subtitle="Poznaj historię Dr.Coco i ludzi, którzy tworzą najlepszą wodę kokosową w Polsce"
        />

        {/* Main Story — from o-nas, kept as-is */}
        <div className="relative mb-16">
          <Image
            src="/about.webp"
            alt="O Dr.Coco"
            width={500}
            height={600}
            className="hidden lg:block float-right ml-8 mb-6 w-[45%] h-auto object-cover rounded-2xl shadow-lg"
          />

          {/* Mobile Image */}
          <div className="lg:hidden mb-8">
            <Image
              src="/about.webp"
              alt="O Dr.Coco"
              width={600}
              height={700}
              className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight text-gray-900">
              Z Azji do Polski – tak powstał Dr. Coco
            </h2>

            <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
              <p>
                Wszystko zaczęło się w 2015 roku od podróży po Azji. To właśnie tam, na plażach
                Tajlandii, odkryliśmy smak prawdziwej wody z młodych kokosów i to, jak genialnie
                stawia ona na nogi po całym dniu w tropikalnym słońcu. Wróciliśmy do Polski, ale nie
                chcieliśmy zostawiać tego klimatu za sobą. Chcieliśmy mieć to dobro zawsze pod ręką
                – w aucie, na treningu czy w biegu przez miasto. Tak narodził się Dr. Coco.
              </p>

              <p>
                Kim jesteśmy? Ludźmi, którzy po prostu dbają o to, co ląduje w ich szklankach. Sami
                żyjemy aktywnie i zależy nam na tym, by pić to, co najlepsze, dlatego tworzymy
                markę, pod którą podpisujemy się obiema rękami. Nie chcemy być niczyim mentorem ani
                mówić, jak ma się żyć – chcemy być towarzyszem, który dostarcza naturalne
                nawodnienie najwyższej jakości.
              </p>

              <p>
                W kwestii składu nie uznajemy kompromisów. Osobiście selekcjonujemy uprawy i dbamy o
                to, by każda partia przeszła rygorystyczne badania w niezależnych laboratoriach w
                Niemczech. Dr. Coco to 100% wody kokosowej, certyfikaty BIO i V-label oraz jakość
                premium, której szukaliśmy dla samych siebie. Czysta natura, bez zbędnej chemii.
              </p>
            </div>
          </div>
        </div>

        {/* Spark & Journey — from nasza-historia, 2-col layout */}
        <div className="mb-20 pt-16 border-t border-gray-200 clear-both">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — The Spark */}
            <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Gdzie wszystko się zaczęło
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Nie wszystko zaczyna się od planu
              </h2>
              <p>
                Podczas podróży po Azji Południowo-Wschodniej, z dala od rytmu codzienności,
                pojawił się obraz, który do dziś jest początkiem Dr Coco.
              </p>

              <div className="border-l-4 border-primary pl-6 py-1 space-y-1 text-gray-600 italic bg-primary/5 rounded-r-lg">
                <p>Spokojna woda.</p>
                <p>Zachodzące słońce.</p>
                <p>Łódź wypełniona kokosami.</p>
              </div>

              <p>
                I myśl — prosta, ale bardzo konkretna:{" "}
                <strong className="text-gray-900">ten smak powinien istnieć wszędzie.</strong>
              </p>
              <p>
                Nie jako interpretacja. Nie jako wersja „pod rynek". Jako coś prawdziwego.
              </p>
            </div>

            {/* Right — The Journey */}
            <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Droga do jakości
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Z tej jednej chwili zaczęła się droga
              </h2>
              <p>
                Rozmowy z ludźmi, którzy znają kokosy od pokoleń. Czas spędzony na plantacjach.
                Dziesiątki prób i decyzji, które nie zawsze były oczywiste.
              </p>
              <p>Ale kierunek od początku był jeden: zachować to, co najprostsze.</p>
              <p>
                Dr Coco powstało z potrzeby jakości, nie z potrzeby produktu. To różnica, którą
                czuć od pierwszego łyku.
              </p>
            </div>
          </div>
        </div>

        {/* CTA — from o-nas */}
        <div className="text-center py-12 border-t border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Dołącz do społeczności Dr.Coco</h2>
          <p className="text-gray-600 mb-6">
            Odkryj nasze produkty i przekonaj się, dlaczego tysiące Polaków wybiera Dr.Coco każdego
            dnia
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
