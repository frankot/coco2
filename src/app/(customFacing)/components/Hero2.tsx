"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  price: number;
};

interface Hero2Props {
  latestProducts?: Product[];
}

export function Hero2({ latestProducts = [] }: Hero2Props) {
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // If no products, don't render the component
  if (!latestProducts?.length) {
    return null;
  }

  return (
    <div className="w-full bg-background py-12">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-primary font-galindo">Najnowsze Produkty</h2>
          <p className="text-muted-foreground mt-2">Odkryj nasze najnowsze, naturalne napoje</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {latestProducts.slice(0, 2).map((product) => (
            <motion.div key={product.id} variants={fadeInUp} className="relative group">
              <Link href={`/sklep/${product.id}`}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-shadow">
                  <div className="relative h-64 mb-4">
                    <Image
                      src={product.imagePath}
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-primary font-galindo mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {product.price.toFixed(2)} zł
                    </span>
                    <Button
                      size="sm"
                      className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Zobacz więcej
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Decorative blur effect */}
              <motion.div
                className="absolute -z-10 w-full h-full rounded-2xl bg-primary/5 blur-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
