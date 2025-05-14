"use client";

import { motion } from "framer-motion";
import { DollarSign, Truck, ThumbsUp, Lock } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Single feature card component
const FeatureCard = ({
  icon: Icon,
  title,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  delay: number;
}) => (
  <motion.div
    className="bg-background/80 backdrop-blur-sm rounded-2xl  p-6 flex flex-col items-center justify-center text-center  transition-all hover:scale-105"
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
  >
    <div className="bg-primary/30 h-24 w-24 rounded-full flex items-center justify-center mb-5">
      <Icon className="h-12 w-12 text-primary" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-galindo text-primary mb-1">{title}</h3>
  </motion.div>
);

export default function Features() {
  return (
    <section className="pt-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <FeatureCard icon={DollarSign} title="GWARANCJA ZWROTU PIENIĘDZY" delay={0} />
          <FeatureCard icon={Truck} title="DARMOWA DOSTAWA" delay={0.1} />
          <FeatureCard icon={ThumbsUp} title="GWARANCJA SATYSFAKCJI" delay={0.2} />
          <FeatureCard icon={Lock} title="BEZPIECZNE PŁATNOŚCI" delay={0.3} />
        </motion.div>
      </div>
    </section>
  );
}
