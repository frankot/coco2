"use client";

import { motion } from "framer-motion";
import { DollarSign, Truck, ThumbsUp, Lock } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const FeatureCard = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <motion.div className="relative group md:h-[230px]" variants={itemVariants}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all border opacity-0 group-hover:opacity-70 " />
    <div className="relative bg-background/50 backdrop-blur-lg border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 transition-all group-hover:translate-y-[-2px] h-full">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg" />
        <div className="relative bg-background border border-primary/10 h-20 w-20 rounded-full flex items-center justify-center">
          <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg  text-primary">{title}</h3>
    </div>
  </motion.div>
);

export default function Features() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 " />
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <FeatureCard icon={DollarSign} title="GWARANCJA ZWROTU PIENIĘDZY" />
          <FeatureCard icon={Truck} title="DARMOWA DOSTAWA" />
          <FeatureCard icon={ThumbsUp} title="GWARANCJA SATYSFAKCJI" />
          <FeatureCard icon={Lock} title="BEZPIECZNE PŁATNOŚCI" />
        </motion.div>
      </div>
    </section>
  );
}
