"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
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
        duration: 0.9,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="w-full  ">
      <div className="container mx-auto h-full lg:h-[80vh] flex flex-col lg:flex-row items-center justify-between gap-8 py-16 lg:py-20 px-4">
        {/* Left side - Text content */}
        <motion.div
          className="w-full lg:w-1/2 space-y-6 lg:pr-8"
          initial="hidden"
          animate="visible"
          variants={fadeInLeft}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight font-galindo"
            variants={fadeInUp}
          >
            Naturalna
            <br />
            Woda Kokosowa <br />
            Dr.Coco
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-foreground/80 max-w-xl" variants={fadeInUp}>
            Odkryj orzeźwiający smak prawdziwej wody kokosowej. Bogata w elektrolity, naturalna i
            bez dodatku cukru. Idealny napój dla aktywnych osób ceniących zdrowy tryb życia.
          </motion.p>

          <motion.div className="pt-4" variants={fadeInUp}>
            <Button size="lg" className="rounded-full px-8">
              Odkryj Dr.Coco
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center gap-8 pt-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <p className="text-3xl font-bold text-primary font-galindo">100%</p>
              <p className="text-muted-foreground">Naturalne</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <p className="text-3xl font-bold text-primary font-galindo">0g</p>
              <p className="text-muted-foreground">Cukru dodanego</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <p className="text-3xl font-bold text-primary font-galindo">5</p>
              <p className="text-muted-foreground">Elektrolitów</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right side - Image */}
        <motion.div
          className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInRight}
        >
          <div className="relative w-full h-full translate-x-12">
            <Image
              src="/butelka-roll.tif"
              alt="Dr.Coco coconut water bottle"
              fill
              priority
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -z-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl right-1/3 top-1/3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.div
            className="absolute -z-10 w-64 h-64 rounded-full bg-secondary/10 blur-2xl left-1/2 bottom-1/4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
