import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Leaf, MapPin, Sparkles } from "lucide-react";

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

const storySteps = [
  {
    label: "2015",
    title: "Pierwszy smak młodego kokosa",
    text: "Podróż po Azji Południowo-Wschodniej pokazała nam, jak prosta i świeża potrafi być prawdziwa woda kokosowa.",
  },
  {
    label: "Źródło",
    title: "Plantacje i ludzie",
    text: "Zamiast szukać skrótów, zaczęliśmy od rozmów z osobami, które znają kokosy od pokoleń.",
  },
  {
    label: "Dr.Coco",
    title: "Ten smak w Polsce",
    text: "Chcieliśmy zachować lekkość, naturalność i jakość, którą pamiętaliśmy z pierwszego łyku.",
  },
];

const values = [
  "100% woda kokosowa",
  "bez zbędnych dodatków",
  "selekcja każdej partii",
  "jakość potwierdzona badaniami",
];

export default function NaszaHistoriaPage() {
  return (
    <main className="min-h-screen overflow-hidden lg:mt-16">
      <section className="py-10 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Leaf className="size-4" />
                Nasza historia
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
                  <span className="text-primary">Z Azji do Polski</span>
                  <br />
                  <span className="text-gray-900">tak powstał Dr.Coco</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                  Wszystko zaczęło się od podróży, tropikalnego słońca i smaku młodego kokosa,
                  którego nie chcieliśmy zostawiać za sobą. Dr.Coco powstało z potrzeby jakości —
                  prostej, naturalnej i odczuwalnej od pierwszego łyku.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {values.map((value) => (
                  <div
                    key={value}
                    className="rounded-2xl border border-primary/10 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
              <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-lg">
                <Image
                  src="/about.webp"
                  alt="O Dr.Coco"
                  width={800}
                  height={1000}
                  priority
                  className="h-[420px] w-full rounded-xl object-cover object-center lg:h-[620px]"
                />
              </div>
              <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">od 2015</p>
                <p className="mt-1 max-w-44 text-lg font-semibold leading-tight text-gray-900">
                  naturalna woda kokosowa dla codziennego rytmu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {storySteps.map((step, index) => (
              <article
                key={step.label}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {step.label}
                  </span>
                  <span className="text-sm text-gray-300">0{index + 1}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                <p className="mt-4 leading-relaxed text-gray-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl bg-primary p-8 text-white shadow-lg lg:p-10">
              <MapPin className="mb-6 size-8 text-white/80" />
              <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
                Nie próbowaliśmy poprawiać natury.
              </h2>
              <p className="mt-5 leading-relaxed text-white/80">
                Naszą rolą było zachować to, co w wodzie kokosowej najważniejsze: lekkość,
                świeżość i czysty skład. Dlatego Dr.Coco nie powstało z potrzeby kolejnego
                produktu, tylko z potrzeby jakości.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:p-10">
              <Sparkles className="mb-6 size-8 text-primary" />
              <h2 className="text-3xl font-bold text-gray-900">Co zostało z tamtej podróży?</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-gray-600">
                <p>
                  Spokojna woda, zachodzące słońce i łódź wypełniona kokosami. Ten obraz stał się
                  początkiem decyzji: taki smak powinien być dostępny także tutaj.
                </p>
                <p>
                  Dziś Dr.Coco to codzienne nawodnienie bez udawania. W aucie, na treningu, w pracy
                  i wtedy, gdy chcesz sięgnąć po coś prostego.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 pb-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-white to-primary/5 p-8 text-center text-gray-900 shadow-sm lg:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Dr.Coco</p>
            <h2 className="mt-3 text-3xl font-bold lg:text-4xl">Poznaj smak, od którego wszystko się zaczęło</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Naturalna woda kokosowa, którą możesz mieć pod ręką każdego dnia.
            </p>
            <Link
              href="/sklep"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Zobacz produkty
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
