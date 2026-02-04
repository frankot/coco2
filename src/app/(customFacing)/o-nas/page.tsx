import Image from "next/image";
import { Users, Target, Heart, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr.Coco | O nas",
  description:
    "Poznaj historię Dr.Coco i ludzi, którzy tworzą najlepszą wodę kokosową w Polsce. Nasza misja to dostarczanie naturalnych produktów najwyższej jakości.",
};

export default function AboutUsPage() {
  const values = [
    { icon: Heart, text: "Pasja do zdrowia" },
    { icon: Target, text: "Jakość produktu" },
    { icon: Users, text: "Społeczność" },
    { icon: TrendingUp, text: "Rozwój" },
  ];

  const founders = [
    {
      name: "Anna Kowalska",
      role: "Współzałożycielka & CEO",
      image: "/team/team1.png", // Placeholder
    },
    {
      name: "Piotr Nowak",
      role: "Współzałożyciel & COO",
      image: "/team/team2.png", // Placeholder
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-primary/5 lg:pt-20">
      {/* Hero Section */}
      <section className="p-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto ">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">O nas</span>
            </h1>
            <p className="text-xl text-gray-600">
              Poznaj historię Dr.Coco i ludzi, którzy tworzą najlepszą wodę kokosową w Polsce
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Floating image on the right */}
          <div className="relative">
            <Image
              src="/about.webp"
              alt="O Dr.Coco"
              width={500}
              height={600}
              className="hidden lg:block float-right ml-8 mb-6 w-[45%] h-auto object-cover rounded-2xl shadow-xl"
            />

            {/* Mobile image */}
            <div className="lg:hidden mb-8">
              <Image
                src="/about.webp"
                alt="O Dr.Coco"
                width={600}
                height={700}
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
                Z Azji do Polski – tak powstał Dr. Coco
              </h2>

              <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
                <p>
                  Wszystko zaczęło się w 2015 roku od podróży po Azji. To właśnie tam, na plażach
                  Tajlandii, odkryliśmy smak prawdziwej wody z młodych kokosów i to, jak genialnie
                  stawia ona na nogi po całym dniu w tropikalnym słońcu. Wróciliśmy do Polski, ale
                  nie chcieliśmy zostawiać tego klimatu za sobą. Chcieliśmy mieć to dobro zawsze pod
                  ręką – w aucie, na treningu czy w biegu przez miasto. Tak narodził się Dr. Coco.
                </p>

                <p>
                  Kim jesteśmy? Ludźmi, którzy po prostu dbają o to, co ląduje w ich szklankach.
                  Sami żyjemy aktywnie i zależy nam na tym, by pić to, co najlepsze, dlatego
                  tworzymy markę, pod którą podpisujemy się obiema rękami. Nie chcemy być Twoim
                  mentorem ani mówić Ci, jak masz żyć – chcemy być Twoim towarzyszem, który
                  dostarcza Ci naturalne nawodnienie najwyższej jakości.
                </p>

                <p>
                  W kwestii składu nie uznajemy kompromisów. Osobiście selekcjonujemy uprawy i dbamy
                  o to, by każda partia przeszła rygorystyczne badania w niezależnych laboratoriach
                  w Niemczech. Dr. Coco to 100% wody kokosowej, certyfikaty BIO i V-label oraz
                  jakość premium, której szukaliśmy dla samych siebie. Czysta natura, bez zbędnej
                  chemii.
                </p>
              </div>

              {/* Founders inline */}
              <div className="pt-8 border-t border-gray-200 mt-8">
                <div className="flex flex-wrap gap-8 items-center">
                  {founders.map((founder, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{founder.name}</h3>
                        <p className="text-sm text-gray-600">{founder.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Dołącz do społeczności Dr.Coco</h2>
          <p className="text-gray-600 mb-6">
            Odkryj nasze produkty i przekonaj się, dlaczego tysiące Polaków wybiera Dr.Coco każdego
            dnia
          </p>
          <a
            href="/sklep"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Zobacz produkty
          </a>
        </div>
      </section>
    </div>
  );
}
