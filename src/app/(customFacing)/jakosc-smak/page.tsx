import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Beaker, Check, Droplets, Leaf, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Jakość i smak",
  description:
    "Jakość nie zaczyna się w fabryce — zaczyna się tam, gdzie rośnie kokos. Dowiedz się, jak Dr Coco dba o autentyczność i smak każdej partii produktu.",
  alternates: {
    canonical: "https://drcoco.pl/jakosc-smak",
  },
  openGraph: {
    title: "Jakość i smak | Dr.Coco",
    description:
      "Jakość nie zaczyna się w fabryce — zaczyna się tam, gdzie rośnie kokos.",
    url: "https://drcoco.pl/jakosc-smak",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Jakość i smak Dr.Coco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakość i smak | Dr.Coco",
    description:
      "Jakość nie zaczyna się w fabryce — zaczyna się tam, gdzie rośnie kokos.",
    images: ["/og-image.webp"],
  },
};

const pillars = [
  {
    icon: Leaf,
    title: "Źródło",
    text: "Wybieramy partie u źródła, bo smak wody kokosowej zależy od odmiany, klimatu i momentu zbioru.",
  },
  {
    icon: Droplets,
    title: "Smak",
    text: "Prawdziwa woda kokosowa jest lekka, świeża i naturalna — bez przesadnej słodyczy i bez sztucznego profilu.",
  },
  {
    icon: Beaker,
    title: "Badania",
    text: "Każda partia przechodzi weryfikację, żeby potwierdzić skład i autentyczność produktu.",
  },
];

const tasteNotes = ["lekka", "czysta", "naturalnie świeża", "delikatnie kokosowa"];

const purityItems = ["bez dodatków", "bez aromatów", "bez koncentratu", "bez konserwantów"];

const featureIcons = [
  { icon: "/icons/SugarFree.png", text: "Bez dodatku cukru" },
  { icon: "/icons/no_conservants.png", text: "Bez konserwantów" },
  { icon: "/icons/vegan.png", text: "Produkt wegański" },
  { icon: "/icons/no_gmo.png", text: "Bez GMO" },
];

export default function JakoscSmakPage() {
  return (
    <main className="min-h-screen overflow-hidden lg:mt-16">
      <section className="py-10 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <ShieldCheck className="size-4" />
                Jakość i smak
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
                  <span className="text-primary">Jakość zaczyna się</span>
                  <br />
                  <span className="text-gray-900">przy kokosie</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                  Woda kokosowa jest tak dobra, jak owoc, z którego pochodzi. Dlatego liczy się
                  pochodzenie, moment zbioru, świeżość i potwierdzony skład — nie marketingowa
                  obietnica.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {featureIcons.map((item) => (
                  <div
                    key={item.text}
                    className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm"
                  >
                    <div className="relative mx-auto h-10 w-10">
                      <Image src={item.icon} alt={item.text} fill sizes="40px" className="object-contain" />
                    </div>
                    <p className="mt-3 text-xs font-medium text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
              <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-lg">
                <Image
                  src="/about1.jpg"
                  alt="Plantacja kokosów Dr.Coco"
                  width={900}
                  height={1100}
                  priority
                  className="h-[420px] w-full rounded-xl object-cover object-center lg:h-[620px]"
                />
              </div>
              <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">u źródła</p>
                <p className="mt-1 max-w-48 text-lg font-semibold leading-tight text-gray-900">
                  wybór owocu decyduje o smaku
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{pillar.title}</h2>
                  <p className="mt-4 leading-relaxed text-gray-600">{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-lg">
              <Image
                src="/about3.jpg"
                alt="Butelki Dr.Coco przy plaży"
                width={900}
                height={1100}
                className="h-[420px] w-full rounded-xl object-cover object-bottom lg:h-[560px]"
              />
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
                  profil smaku
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 lg:text-5xl">
                  Smak, który nie został zaprojektowany. Został zachowany.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-gray-600">
                  Naturalna woda kokosowa nie musi być identyczna w każdej partii. Subtelne różnice
                  są częścią produktu — znakiem, że nie został ujednolicony na siłę.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tasteNotes.map((note) => (
                  <div key={note} className="rounded-2xl bg-primary/10 px-5 py-4 font-semibold text-primary">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl bg-primary p-8 text-white shadow-lg lg:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/70">skład</p>
              <div className="mt-6 text-7xl font-bold leading-none lg:text-8xl">100%</div>
              <h2 className="mt-4 text-3xl font-bold">woda kokosowa</h2>
              <p className="mt-5 leading-relaxed text-white/80">
                Prosty skład jest najważniejszą deklaracją jakości. Bez dopisywania tego, czego
                natura nie potrzebuje.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:p-10">
              <h2 className="text-3xl font-bold text-gray-900">Czego nie dodajemy</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {purityItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-4" />
                    </span>
                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-primary/10 bg-primary/5 p-5 text-gray-700">
                Każda partia przechodzi dodatkową weryfikację: sprawdzamy gęstość produktu, profil
                składu i pochodzenie cukrów.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 pb-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-white to-primary/5 text-gray-900 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 lg:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Dr.Coco</p>
              <h2 className="mt-3 text-3xl font-bold lg:text-4xl">
                Sprawdź, czym jest prawdziwa woda kokosowa
              </h2>
              <p className="mt-4 max-w-2xl text-gray-600">
                Jakość, którą opisujemy słowami — poczujesz od pierwszego łyku.
              </p>
              <Link
                href="/sklep"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Zobacz produkty
                <ArrowRight className="size-5" />
              </Link>
            </div>
            <div className="relative min-h-72 lg:min-h-full">
              <Image
                src="/about4.jpg"
                alt="Dr.Coco na co dzień"
                fill
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent lg:bg-gradient-to-r" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
