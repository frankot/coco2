"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Czy Dr. Coco ma dodany cukier?",
    a: "Nie! Słodycz, którą czujesz, to w 100% natura prosto z wnętrza kokosa. Nie dosładzamy, nie poprawiamy natury – jest idealnie tak, jak jest.",
  },
  {
    q: "Skąd pochodzi woda?",
    a: "Nasze kokosy rosną w Tajlandii (odmiana Nam Hom) oraz na Filipinach. To tamtejszy klimat sprawia, że Dr. Coco smakuje tak dobrze.",
  },
  {
    q: "Czy dzieci mogą pić Dr. Coco?",
    a: "Jasne! to po prostu naturalny sok roślinny. Świetna alternatywa dla słodzonych napojów do szkoły czy na trening.",
  },
  {
    q: "Jak najlepiej pić Dr. Coco?",
    a: "Najlepiej smakuje schłodzona. Zamiast kostek lodu, potrzymaj ją trochę w lodówce lub coolerze. A później… weź ją ze sobą na trening, do pracy albo zrób na jej bazie ulubioną matchę.",
  },
  {
    q: "Dlaczego woda jest pasteryzowana?",
    a: "Bo Dr. Coco to czysty sok roślinny, a nie produkt z laboratorium. Zawiera naturalne cukry i minerały, które bez pasteryzacji bardzo szybko by sfermentowały. Pasteryzacja to tylko krótkie podgrzanie, dzięki któremu woda zachowuje swój smak i wartości, a my nie musimy dodawać żadnych konserwantów.",
  },
  {
    q: "Jak powinna smakować prawdziwa woda kokosowa?",
    a: "Delikatnie, orzeźwiająco i naturalnie słodko. Jeśli kiedykolwiek piłeś/aś wodę prosto z młodego kokosa na plaży, to dokładnie ten smak. Dr. Coco nie jest mdły ani sztucznie aromatyzowany – smakuje po prostu słońcem i naturą, nie wiórkami kokosowymi.",
  },
  {
    q: "Czy woda kokosowa jest zdrowa?",
    a: "Dr. Coco to czysta natura w butelce. Jest bogata w elektrolity, takie jak potas i magnez, które pomagają utrzymać nawodnienie na odpowiednim poziomie. To świetna, prosta i pyszna alternatywa dla napojów z długim składem i sztucznymi barwnikami.",
  },
  {
    q: "Czy woda kokosowa wpływa na cerę?",
    a: "Podstawą promiennej cery jest nawodnienie, a w tym woda kokosowa jest mistrzem. Dzięki zawartości minerałów i witamin wspiera Twój organizm od środka. Pamiętaj: nawodnione ciało to szczęśliwsza skóra, ale Dr. Coco to nie magiczny eliksir młodości – to po prostu bardzo dobry wybór dla Twojego organizmu.",
  },
];

export function Faq() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Centered Title */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-primary">Najczęstsze</span>
            <br />
            <span className="text-gray-900">pytania</span>
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Zebraliśmy najczęściej zadawane pytania, aby szybko rozwiać wątpliwości i pomóc Ci
            wybrać najlepszą wodę kokosową na co dzień.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="">
          <Accordion type="single" defaultValue="faq-0" collapsible>
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-b last:border-b-0">
                <AccordionTrigger className="px-6 py-4 text-base font-medium text-gray-900 hover:no-underline hover:text-primary transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default Faq;
