"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const faqData = [
  {
    question: "FULL OF GOOD STUFF",
    answer:
      "Coconuts are packed with nutrients including fiber, vitamins, minerals, and healthy fats that support overall health and wellness.",
  },
  {
    question: "MAKES TASTEBUDS HAPPY",
    answer:
      "The naturally sweet, creamy flavor of coconuts enhances both sweet and savory dishes while providing a tropical taste experience.",
  },
  {
    question: "TAKES YOU TO THE TROPICS",
    answer:
      "Every sip and bite of coconut transports you to a sunny beach paradise with swaying palm trees and ocean breezes.",
  },
  {
    question: "FEEL GOOD FUEL",
    answer:
      "The medium-chain triglycerides (MCTs) in coconuts provide clean, sustained energy to power you through your day.",
  },
];

export function Faq() {
  return (
    <section className="container mx-auto py-12 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6">
        <div className="relative h-[500px] w-full shadow-2xl rounded-2xl overflow-hidden">
          <Image
            src="/faq.jpg"
            alt="Tropical coconuts with flowers"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-galindo mb-8 text-green-800 drop-shadow-sm">COCONUTS? WHY?</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-green-200 py-2"
              >
                <AccordionTrigger 
                  className="font-galindo text-xl text-green-700 hover:text-green-900 hover:no-underline group"
                >
                  {item.question}
      
                </AccordionTrigger>
                <AccordionContent className="text-green-600 bg-white/50 p-4 rounded-lg mt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
