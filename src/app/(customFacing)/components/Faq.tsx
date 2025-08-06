"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles, Heart, Sun, Check } from "lucide-react";

const faqData = [
  {
    id: "ingredients",
    title: "Pełen Dobrych Składników",
    shortDesc: "Naturalne składniki odżywcze",
    fullDesc:
      "Kokosy są prawdziwą skarbnicą składników odżywczych. Zawierają wysokiej jakości błonnik, który wspiera zdrowie jelit, witaminy z grupy B oraz C, minerały jak potas, magnez i żelazo. Zdrowe tłuszcze MCT zapewniają długotrwałą energię i wspierają metabolizm. Każdy produkt DR.COCO® to koncentrat naturalnego zdrowia prosto z tropików.",
    icon: Leaf,
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "taste",
    title: "Wyjątkowy Smak",
    shortDesc: "Tropikalne doznania smakowe",
    fullDesc:
      "Naturalnie słodki, kremowy smak kokosów to prawdziwa uczta dla podniebienia. Nasza unikalna technologia przetwarzania zachowuje autentyczny, tropikalny aromat, który doskonale komponuje się zarówno ze słodkimi deserami, jak i wytrawnymi daniami. Każdy łyk to podróż do słonecznych plaż i kołyszących się palm kokosowych.",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
  },
  {
    id: "tropics",
    title: "Przenosi do Tropików",
    shortDesc: "Wakacyjne wspomnienia w każdym łyku",
    fullDesc:
      "Zamknij oczy i poczuj ciepły, tropikalny wiatr. Nasze produkty kokosowe to nie tylko jedzenie - to prawdziwa podróż do raju. Słoneczne plaże, turkusowa woda, szum palm i zapach kwiatów frangipani. Każdy produkt DR.COCO® przenosi Cię do magicznego świata tropików, gdzie czas płynie wolniej, a życie smakuje lepiej.",
    icon: Sun,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "energy",
    title: "Zdrowa Energia",
    shortDesc: "Naturalne źródło mocy",
    fullDesc:
      "Trójglicerydy średniołańcuchowe (MCT) to prawdziwy sekret kokosów. Te wyjątkowe tłuszcze są szybko metabolizowane przez organizm, zapewniając czystą, długotrwałą energię bez skoków cukru. Idealne dla aktywnych osób, sportowców i wszystkich, którzy chcą czuć się pełni energii przez cały dzień. To naturalne paliwo dla Twojego ciała i umysłu.",
    icon: Sparkles,
    color: "from-purple-400 to-indigo-500",
  },
];

export function Faq() {
  const [selectedFeature, setSelectedFeature] = useState(faqData[0]);

  return (
    <section className="relative py-24 overflow-hidden">

      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                DLACZEGO DR.COCO®
              </div>
              <h2 className="text-3xl font-galindo lg:text-4xl font-bold text-gray-900">
                Poznaj Moc
                <span className="text-primary "> Kokosa</span>
              </h2>
            </div>

            <div className="space-y-4">
              {faqData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedFeature(item)}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group cursor-pointer relative z-10 ${
                      selectedFeature.id === item.id
                        ? "bg-primary/10 border-2 border-primary shadow-lg transform scale-[1.02]"
                        : "bg-white/80 border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex items-start gap-4 pointer-events-none">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${item.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold mb-2 transition-colors ${
                            selectedFeature.id === item.id
                              ? "text-primary"
                              : "text-gray-900 group-hover:text-primary/80"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.shortDesc}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                          selectedFeature.id === item.id
                            ? "border-primary bg-primary"
                            : "border-gray-300 group-hover:border-primary/60"
                        }`}
                      >
                        {selectedFeature.id === item.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${selectedFeature.color}`}
                ></div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedFeature.color}`}>
                      <selectedFeature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {selectedFeature.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    {selectedFeature.fullDesc}
                  </p>

                  <div className="flex items-center gap-3 pt-4">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedFeature.color}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-500">
                      Naturalne • Zdrowe • Tropikalne
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Image */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl">
              <Image src="/faq.jpg" alt="Tropical coconuts" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full"></div>
            <div className="absolute top-1/3 -right-2 w-4 h-4 bg-yellow-400/30 rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
