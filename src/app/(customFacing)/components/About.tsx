"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function About() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="overflow-hidden py-24 sm:py-32 sm:pb-0">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        {/* Header Section */}
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <p className="text-base/7 font-semibold ">O Dr.Coco</p>
          <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl font-galindo text-primary">
            Naturalne źródło <br /> nawodnienia i energii
          </h1>
          <p className="mt-6 text-balance text-xl/8 text-gray-700">
            Woda kokosowa Dr.Coco to czyste źródło natury - nic dodanego, nic odjętego. Wydobywamy
            ją bezpośrednio z młodych, zielonych kokosów, aby zachować wszystkie wartości odżywcze i
            wyjątkowy smak.
          </p>
        </motion.div>
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          {/* Mission Section */}
          <motion.div
            className="lg:pr-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-primary font-galindo">
              Nasza misja
            </h2>
            <p className="mt-6 text-base/7 text-gray-600">
              W Dr.Coco wierzymy, że natura dostarcza nam wszystkiego, czego potrzebujemy do
              zdrowego życia. Nasza misja to dostarczać najwyższej jakości wodę kokosową, która
              zachwyca smakiem i odżywia organizm, jednocześnie dbając o środowisko i wspierając
              zrównoważone rolnictwo.
            </p>
            <p className="mt-8 text-base/7 text-gray-600">
              Każda butelka Dr.Coco to gwarancja czystości i jakości. Nie dodajemy cukru,
              konserwantów ani sztucznych aromatów. Nasza woda kokosowa jest naturalnie słodka,
              orzeźwiająca i bogata w elektrolity, co czyni ją idealnym napojem dla aktywnych osób,
              sportowców oraz wszystkich ceniących zdrowy styl życia.
            </p>
          </motion.div>
          {/* Images Grid */}
          <motion.div
            className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInRight}
            transition={{ delay: 0.3 }}
          >
            <div className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8">
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10">
                <Image
                  alt="Świeże kokosy Dr.Coco"
                  src="/about1.jpg"
                  width={560}
                  height={560}
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10 lg:-mt-40">
                <Image
                  alt="Naturalna woda kokosowa Dr.Coco"
                  src="/about2.jpg"
                  width={560}
                  height={560}
                  className="block size-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10">
                <Image
                  alt="Zdrowy styl życia z Dr.Coco"
                  src="/about3.jpg"
                  width={560}
                  height={560}
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10 lg:-mt-40">
                <Image
                  alt="Ekologiczna produkcja Dr.Coco"
                  src="/about4.jpg"
                  width={560}
                  height={560}
                  className="block size-full object-cover"
                />
              </div>
            </div>
          </motion.div>
          {/* Stats Section */}
          <motion.div
            className="max-lg:mt-16 lg:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <p className="text-base/7 font-semibold text-gray-500">Wartości odżywcze</p>
            <hr className="mt-6 border-t border-gray-200" />
            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                <dt className="text-sm/6 text-gray-600">Kalorie</dt>
                <dd className="order-first text-6xl font-semibold text-primary font-galindo tracking-tight">
                  <span>45</span>
                  <span className="text-base font-normal ml-1">kcal</span>
                </dd>
              </div>
              <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                <dt className="text-sm/6 text-gray-600">Potas</dt>
                <dd className="order-first text-6xl font-semibold text-primary font-galindo tracking-tight">
                  <span>600</span>
                  <span className="text-base font-normal ml-1">mg</span>
                </dd>
              </div>
              <div className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4">
                <dt className="text-sm/6 text-gray-600">Cukry</dt>
                <dd className="order-first text-6xl font-semibold text-primary font-galindo tracking-tight">
                  <span>6</span>
                  <span className="text-base font-normal ml-1">g</span>
                </dd>
              </div>
              <div className="flex flex-col gap-y-2">
                <dt className="text-sm/6 text-gray-600">Wapń</dt>
                <dd className="order-first text-6xl font-semibold text-primary font-galindo tracking-tight">
                  <span>58</span>
                  <span className="text-base font-normal ml-1">mg</span>
                </dd>
              </div>
            </dl>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default About;
