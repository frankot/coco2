"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Sparkles, Heart, Sun } from "lucide-react";

const faqData = [
  {
    question: "PEŁEN DOBRYCH SKŁADNIKÓW",
    answer:
      "Kokosy są bogate w składniki odżywcze, w tym błonnik, witaminy, minerały i zdrowe tłuszcze, które wspierają ogólne zdrowie i dobre samopoczucie.",
    icon: Leaf,
  },
  {
    question: "WYJĄTKOWY SMAK",
    answer:
      "Naturalnie słodki, kremowy smak kokosów wzbogaca zarówno słodkie, jak i wytrawne dania, zapewniając tropikalne doznania smakowe.",
    icon: Heart,
  },
  {
    question: "PRZENOSI DO TROPIKÓW",
    answer:
      "Każdy łyk i kęs kokosa przenosi Cię do słonecznego raju na plaży z kołyszącymi się palmami i morską bryzą.",
    icon: Sun,
  },
  {
    question: "ZDROWA ENERGIA",
    answer:
      "Trójglicerydy średniołańcuchowe (MCT) zawarte w kokosach zapewniają czystą, długotrwałą energię, która pomoże Ci przetrwać cały dzień.",
    icon: Sparkles,
  },
];

export function Faq() {
  return (
    <div className="bg-primary relative overflow-hidden">
      <section className="container mx-auto py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent z-10 rounded-3xl" />
            <Image
              src="/faq.jpg"
              alt="Tropical coconuts with flowers"
              fill
              className="object-cover object-top rounded-3xl hover:scale-105 transition-all duration-700"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-yellow-300 text-sm font-medium tracking-wider uppercase">
                DLACZEGO DR.COCO®
              </span>
              <h2 className="text-4xl font-galindo text-white">Poznaj Moc Kokosa</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-b-0 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                      <div className="flex items-center gap-3">
                        <item.icon className="size-6 text-yellow-300 group-hover:scale-110 transition-all duration-300" />
                        <span className="font-galindo text-lg text-white group-hover:text-yellow-300 transition-colors">
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-white/80">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
