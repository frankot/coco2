"use client";

import { CalendarCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function Newsletter() {
  return (
    <div className="relative isolate overflow-hidden bg-primary py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl lg:max-w-lg"
          >
            <span className="text-yellow-300 text-sm font-medium tracking-wider uppercase">
              NEWSLETTER DR.COCO®
            </span>
            <h2 className="mt-4 text-4xl text-white">
              Dołącz do Kokosowej Społeczności
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Zapisz się do naszego newslettera, aby otrzymywać najnowsze informacje o produktach,
              promocjach i ciekawostki ze świata wody kokosowej.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <Input
                type="email"
                required
                placeholder="Twój adres email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              <Button className="bg-yellow-300 text-primary hover:bg-yellow-400 font-medium px-6">
                Zapisz się
              </Button>
            </div>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2"
          >
            <div className="flex flex-col items-start">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 group">
                <CalendarCheck className="size-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <dt className="mt-4 text-lg text-white">Cotygodniowe Nowości</dt>
              <dd className="mt-2 text-base leading-7 text-white/70">
                Bądź na bieżąco z najnowszymi produktami, przepisami i poradami dotyczącymi zdrowego
                stylu życia z Dr.Coco.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 group">
                <ShieldCheck className="size-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <dt className="mt-4 text-lg text-white">Gwarancja Jakości</dt>
              <dd className="mt-2 text-base leading-7 text-white/70">
                Tylko wartościowe treści i oferty specjalne. Szanujemy Twoją prywatność i nie
                wysyłamy spamu.
              </dd>
            </div>
          </motion.dl>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-yellow-300/30 to-green-500/30 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
