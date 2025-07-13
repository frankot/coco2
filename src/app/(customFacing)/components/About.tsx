"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Droplet, Award, Heart } from "lucide-react";

export function About() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const nutritionFacts = [
    { label: "Kalorie", value: "45", unit: "kcal", icon: Droplet },
    { label: "Potas", value: "600", unit: "mg", icon: Heart },
    { label: "Cukry", value: "6", unit: "g", icon: Leaf },
    { label: "Wapń", value: "58", unit: "mg", icon: Award },
  ];

  return (
    <section className="py-16 lg:py-24 ">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />O Dr.Coco
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Naturalne źródło
            <span className="text-primary block">nawodnienia i energii</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
            Woda kokosowa Dr.Coco to czyste źródło natury - nic dodanego, nic odjętego. Wydobywamy
            ją bezpośrednio z młodych, zielonych kokosów, aby zachować wszystkie wartości odżywcze i
            wyjątkowy smak.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Mission */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Nasza misja</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                W Dr.Coco wierzymy, że natura dostarcza nam wszystkiego, czego potrzebujemy do
                zdrowego życia. Nasza misja to dostarczać najwyższej jakości wodę kokosową, która
                zachwyca smakiem i odżywia organizm.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Każda butelka Dr.Coco to gwarancja czystości i jakości. Nie dodajemy cukru,
                konserwantów ani sztucznych aromatów. Nasza woda kokosowa jest naturalnie słodka,
                orzeźwiająca i bogata w elektrolity.
              </p>
            </div>

            {/* Nutrition Facts */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              variants={staggerChildren}
            >
              <h4 className="text-xl font-bold text-gray-900 mb-6">Wartości odżywcze</h4>
              <div className="grid grid-cols-2 gap-4">
                {nutritionFacts.map((fact, index) => (
                  <motion.div
                    key={fact.label}
                    className="text-center p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors"
                    variants={fadeInUp}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <fact.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                      {fact.value}
                      <span className="text-sm font-normal text-gray-600 ml-1">{fact.unit}</span>
                    </div>
                    <div className="text-sm text-gray-600">{fact.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Images */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInRight}
            transition={{ delay: 0.3 }}
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl transform rotate-3"></div>

              {/* Images Grid */}
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-2xl">
                      <Image
                        alt="Świeże kokosy Dr.Coco"
                        src="/about1.jpg"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-2xl">
                      <Image
                        alt="Zdrowy styl życia z Dr.Coco"
                        src="/about3.jpg"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="aspect-square overflow-hidden rounded-2xl">
                      <Image
                        alt="Naturalna woda kokosowa Dr.Coco"
                        src="/about2.jpg"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-2xl">
                      <Image
                        alt="Ekologiczna produkcja Dr.Coco"
                        src="/about4.jpg"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">100% Naturalne</div>
                    <div className="text-xs text-gray-500">Bez konserwantów</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Row */}
        <motion.div
          className="mt-16 lg:mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerChildren}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Droplet, title: "Naturalne nawodnienie", desc: "Bogate w elektrolity" },
              { icon: Leaf, title: "Zero dodatków", desc: "Bez cukru i konserwantów" },
              { icon: Heart, title: "Zdrowe życie", desc: "Wsparcie dla organizmu" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
