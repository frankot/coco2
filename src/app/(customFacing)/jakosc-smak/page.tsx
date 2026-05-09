import Image from "next/image";
import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";

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

export default function JakoscSmakPage() {
  return (
    <div className="min-h-screen lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          accent="Jakość i smak"
          subtitle="Jakość nie zaczyna się w fabryce. Zaczyna się tam, gdzie rośnie kokos."
        />

        {/* Źródło */}
        <div className="relative mb-16">
          <Image
            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80"
            alt="Plantacja kokosów"
            width={500}
            height={650}
            className="hidden lg:block float-right ml-10 mb-6 w-[43%] h-auto object-cover rounded-2xl shadow-lg"
          />

          {/* Mobile Image */}
          <div className="lg:hidden mb-8">
            <Image
              src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80"
              alt="Plantacja kokosów"
              width={800}
              height={500}
              className="w-full h-[320px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="space-y-5">
            <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
              Tam, gdzie wszystko się zaczyna
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Źródło</h2>

            <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
              <p>
                Woda kokosowa jest tak dobra, jak dobry jest owoc, z którego
                pochodzi. Odmiana, klimat, moment zbioru — wszystko ma znaczenie.
              </p>
              <p>
                Dlatego pracujemy bezpośrednio u źródła i wybieramy tylko te
                partie, które spełniają nasze standardy. Nie ma tu miejsca na
                przypadek.
              </p>
            </div>
          </div>
        </div>

        {/* Smak + Naturalność */}
        <div className="mb-20 pt-16 border-t border-gray-200 clear-both">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Smak */}
            <div className="space-y-5">
              <Image
                src="https://images.unsplash.com/photo-1571740100673-ae00b87f68b2?w=700&q=80"
                alt="Szklanka wody kokosowej"
                width={700}
                height={440}
                className="w-full h-64 object-cover rounded-2xl shadow-sm"
              />
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Autentyczność w każdej kropli
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Smak
              </h2>
              <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                Prawdziwa woda kokosowa nie jest intensywna. Nie próbuje się
                podobać.
              </p>

              <div className="border-l-4 border-primary pl-6 py-1 space-y-1 text-gray-600 italic bg-primary/5 rounded-r-lg">
                <p>lekka,</p>
                <p>czysta,</p>
                <p>naturalnie świeża,</p>
                <p>czasem delikatnie kwaskowata, czasem bardziej miękka.</p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Zawsze autentyczna. To nie jest smak, który został
                zaprojektowany. To smak, który został zachowany.
              </p>
            </div>

            {/* Naturalność */}
            <div className="space-y-5">
              <Image
                src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=700&q=80"
                alt="Naturalne owoce tropikalne"
                width={700}
                height={440}
                className="w-full h-64 object-cover rounded-2xl shadow-sm"
              />
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Tak jak stworzyła natura
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Naturalność
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base lg:text-lg">
                <p>
                  Produkty naturalne nie są identyczne. I nie powinny być.
                </p>
                <p>
                  Każda partia może różnić się subtelnie — to znak, że nic nie
                  zostało ujednolicone na siłę. To znak, że produkt żyje.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Potwierdzona autentyczność */}
        <div className="mb-20 pt-16 border-t border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Zaufanie poparte badaniami
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Potwierdzona autentyczność
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base lg:text-lg">
                <p>
                  Dla nas naturalność to nie deklaracja. To coś, co musi być
                  potwierdzone.
                </p>
                <p>
                  Dlatego każda partia Dr Coco przechodzi dodatkową weryfikację w
                  niezależnym instytucie biotechnologii.
                </p>
              </div>

              <p className="text-gray-700 font-medium">Sprawdzamy między innymi:</p>

              <div className="border-l-4 border-primary pl-6 py-1 space-y-1 text-gray-600 italic bg-primary/5 rounded-r-lg">
                <p>gęstość produktu,</p>
                <p>profil składu,</p>
                <p>pochodzenie cukrów.</p>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Dzięki temu mamy pewność, że to, co trafia do opakowania, jest
                rzeczywiście tym, czym powinno być — naturalną wodą kokosową, a
                nie jej interpretacją.
              </p>
            </div>

            <div>
              <Image
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=700&q=80"
                alt="Badania laboratoryjne"
                width={700}
                height={600}
                className="w-full h-[420px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Skład + Podejście */}
        <div className="mb-20 pt-16 border-t border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Skład */}
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Bez kompromisów
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Skład
              </h2>

              <p className="text-2xl font-semibold text-primary">
                100% woda kokosowa
              </p>

              <div className="border-l-4 border-primary pl-6 py-1 space-y-1 text-gray-600 italic bg-primary/5 rounded-r-lg">
                <p>Bez dodatków.</p>
                <p>Bez aromatów.</p>
                <p>Bez koncentratu.</p>
              </div>
            </div>

            {/* Podejście */}
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-widest text-primary/70 font-medium">
                Filozofia marki
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Podejście
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base lg:text-lg">
                <p>
                  Nie próbujemy poprawiać natury. Naszą rolą jest jej nie
                  zepsuć.
                </p>
                <p>
                  Dlatego podejmujemy decyzje, które nie zawsze są najłatwiejsze
                  — ale zawsze właściwe.
                </p>
              </div>

              <div className="border-l-4 border-gray-900 pl-6 py-3">
                <p className="text-gray-900 font-semibold text-lg">
                  Efekt jest prosty: produkt, który nie potrzebuje tłumaczenia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Sprawdź, czym jest prawdziwa woda kokosowa
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Jakość, którą opisujemy słowami — poczujesz od pierwszego łyku.
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
