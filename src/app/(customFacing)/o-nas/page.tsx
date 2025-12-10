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
              src="/o-nas.webp"
              alt="O Dr.Coco"
              width={500}
              height={600}
              className="hidden lg:block float-right ml-8 mb-6 w-[45%] h-auto object-cover rounded-2xl shadow-xl"
            />
            
            {/* Mobile image */}
            <div className="lg:hidden mb-8">
              <Image
                src="/o-nas.webp"
                alt="O Dr.Coco"
                width={600}
                height={700}
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
                Z Wietnamu do Polski – historia Dr.Coco
              </h2>

              <div className="space-y-5 text-gray-700 leading-relaxed text-base lg:text-lg">
                <p>
                  Wszystko zaczęło się od podróży do regionu <strong>Bến Tre w Wietnamie</strong> – 
                  miejsca, które nazywane jest stolicą wody kokosowej. To tam, wśród palm kokosowych 
                  rosnących w idealnych warunkach tropikalnych, odkryliśmy prawdziwą esencję naturalnego 
                  smaku i właściwości młodych, zielonych kokosów.
                </p>

                <p>
                  Zachwyceni tym, co oferuje natura, postanowiliśmy podzielić się tym smakiem z Polakami. 
                  Nawiązaliśmy współpracę z lokalnymi farmami, które od pokoleń uprawiają kokosy, 
                  dbając o ich najwyższą jakość. Każdy kokos jest zbierany ręcznie we właściwym czasie, 
                  aby zachować pełnię wartości odżywczych i niepowtarzalny, delikatny smak.
                </p>

                <p>
                  Dziś <strong>Dr.Coco</strong> to więcej niż marka – to wybór świadomych konsumentów, 
                  którzy cenią naturalność, autentyczność i zdrowie. Bez dodatku cukru, bez konserwantów, 
                  bez sztucznych dodatków. Tylko czysta woda kokosowa, bogata w elektrolity, potas 
                  i magnez – idealny naturalny izotonik dla aktywnych.
                </p>

                <p className="text-primary font-medium italic">
                  "Każdego dnia dokładamy starań, aby woda kokosowa Dr.Coco docierała do Was w formie, 
                  w jakiej stworzyła ją natura."
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
