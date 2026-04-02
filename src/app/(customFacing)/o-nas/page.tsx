import Image from "next/image";
import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Poznaj historię Dr.Coco® i ludzi, którzy tworzą najlepszą naturalną wodę kokosową w Polsce. Nasza misja to dostarczanie zdrowych produktów najwyższej jakości prosto z Wietnamu.",
  alternates: {
    canonical: "https://drcoco.pl/o-nas",
  },
  openGraph: {
    title: "O nas | Dr.Coco",
    description:
      "Poznaj historię Dr.Coco® - producenta najlepszej naturalnej wody kokosowej w Polsce.",
    url: "https://drcoco.pl/o-nas",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Zespół Dr.Coco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O nas | Dr.Coco",
    description:
      "Poznaj historię Dr.Coco® - producenta najlepszej naturalnej wody kokosowej w Polsce.",
    images: ["/og-image.webp"],
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          accent="O nas"
          subtitle="Poznaj historię Dr.Coco i ludzi, którzy tworzą najlepszą wodę kokosową w Polsce"
        />

        {/* Main Story */}
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
                markę, pod którą podpisujemy się obiema rękami. Nie chcemy być Twoim mentorem ani
                mówić Ci, jak masz żyć – chcemy być Twoim towarzyszem, który dostarcza Ci naturalne
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

        {/* CTA */}
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
