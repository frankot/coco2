import Image from "next/image";
import { Users, Target, Heart, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr.Coco | O nas",
  description: "Poznaj historię Dr.Coco i ludzi, którzy tworzą najlepszą wodę kokosową w Polsce. Nasza misja to dostarczanie naturalnych produktów najwyższej jakości.",
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
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-gray-900">Nasza historia</span>
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  Dr.Coco powstało z pasji do zdrowego stylu życia i pragnienia dostarczenia Polakom
                  napoju, który łączy w sobie wyjątkowy smak z niezwykłymi właściwościami
                  zdrowotnymi. Wszystko zaczęło się od podróży do Wietnamu, gdzie odkryliśmy
                  autentyczną wodę kokosową prosto z młodych, zielonych kokosów.
                </p>

                <p>
                  Zachwyceni jej naturalnym smakiem i właściwościami, postanowiliśmy podzielić się
                  tym odkryciem z Polską. Rozpoczęliśmy współpracę z lokalnymi farmami w regionie
                  Bến Tre - uznawanej stolicy wody kokosowej w Wietnamie. To właśnie tam, w
                  idealnych warunkach klimatycznych, rosną kokosy o najwyższej jakości.
                </p>

                <p>
                  Dziś Dr.Coco to nie tylko marka - to społeczność ludzi dbających o swoje zdrowie,
                  ceniących naturalność i autentyczność produktów. Każdego dnia dokładamy starań,
                  aby nasza woda kokosowa trafiała do Was w najlepszej możliwej formie, zachowując
                  wszystkie naturalne wartości odżywcze i niepowtarzalny smak.
                </p>

                <p>
                  Wierzymy, że zdrowy styl życia nie musi być trudny ani pozbawiony przyjemności.
                  Dlatego nasza misja to dostarczanie produktów, które są zarówno pyszne, jak i
                  pełne naturalnych składników odżywczych. Dr.Coco to doskonały wybór dla każdego -
                  sportowców, aktywnych rodziców, dzieci i wszystkich, którzy cenią sobie zdrowie.
                </p>
              </div>

              {/* Founders integrated below content */}
              <div className="flex justify-start gap-12 pt-4">
                {founders.map((founder, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{founder.name}</h3>
                    <p className="text-sm text-primary font-medium">{founder.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="order-first lg:order-last">
              <div className="relative">
                <Image
                  src="/o-nas.webp"
                  alt="O Dr.Coco"
                  width={600}
                  height={700}
                  className="w-full h-[600px] lg:h-[800px] object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Nasze wartości</h2>
            <p className="text-gray-600">Co nas wyróżnia i czym się kierujemy</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{value.text}</h3>
              </div>
            ))}
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
