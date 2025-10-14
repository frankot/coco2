import Image from "next/image";
import { Leaf, Shield, Droplet, Heart, Award } from "lucide-react";

export function About() {
  const features = [
    { icon: Droplet, text: "Bez dodatku cukru" },
    { icon: Leaf, text: "Bez sztucznych dodatków i konserwantów" },
    { icon: Shield, text: "Produkt wegański" },
    { icon: Heart, text: "Produkt niskokaloryczny" },
    { icon: Award, text: "Bez glutenu" },
  ];

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Large Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <Image
                src="/ab2.jpg"
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
                Woda kokosowa Dr.Coco® to naturalny izotonik, który w ciągu kilku lat podbił
                polski rynek, stając się znacznie zdrowszą alternatywą dla kolorowych napojów
                izotonicznych zawierających sztuczne dodatki. Nasza woda pochodzi z organicznych
                farm z regionu Bến Tre - stolicy wody kokosowej, gdzie kokosy żywane są co kilka
                tygodni.
              </p>
              <p>
                Dr.Coco® to doskonały element codziennej diety niezależnie od wieku. To naturalne
                źródło minerałów i mikroelementów dla aktywnych, a także tych, którzy chcą zadbać o
                swoje zdrowie.
              </p>
            </div>

            {/* Features with icons */}
            <div className=" flex">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col max-w-32 gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
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
