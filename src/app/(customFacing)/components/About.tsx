import Image from "next/image";

export function About() {
  const features = [
    { icon: "/icons/SugarFree.png", text: "Bez dodatku cukru" },
    { icon: "/icons/no_conservants.png", text: "Bez konserwantów" },
    { icon: "/icons/vegan.png", text: "Produkt wegański" },
    { icon: "/icons/GlutenFree.png", text: "Bez glutenu" },
    { icon: "/icons/DairyFree.png", text: "Bez laktozy" },
    { icon: "/icons/no_gmo.png", text: "Bez GMO" },
  ];

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Large Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <Image
                src="/ab.webp"
                alt="Woda kokosowa z młodych kokosów"
                width={600}
                height={700}
                className="w-full h-[600px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Two-color title */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-primary">Woda kokosowa</span>
                <br />
                <span className="text-gray-900">z młodych kokosów</span>
              </h2>
            </div>

            {/* Description text */}
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
     Dr. Coco® to 100% naturalna woda kokosowa, pozyskiwana z młodych kokosów rosnących na certyfikowanych, organicznych farmach w Tajlandii i na Filipinach – sercu światowej produkcji wody kokosowej. Dzięki regularnym zbiorom i tropikalnemu klimatowi zachowuje świeżość, naturalny smak i pełnię wartości odżywczych.
              </p>
              <p>
  Naturalnie bogata w elektrolity, Dr. Coco® działa jak naturalny izotonik – nawadnia, wspiera organizm i stanowi czystą alternatywę dla kolorowych napojów z dodatkami. Idealna na co dzień: po treningu, w pracy i zawsze wtedy, gdy chcesz pić świadomie.
              </p>
            </div>

            {/* Features with icons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col gap-3 items-center text-center">
                  <div className="w-16 h-16 lg:size-10 relative">
                    <Image src={feature.icon} alt={feature.text} fill className="object-contain" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors">
                Poznaj produkty Dr.Coco
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
