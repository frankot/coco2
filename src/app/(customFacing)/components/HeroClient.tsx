"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart, type Product } from "@/app/(customFacing)/components/Cart";

interface HeroClientProps {
  products: Product[];
}

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

export function HeroClient({ products }: HeroClientProps) {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(products.map((p) => [p.id, 1]))
  );
  const [isAddingToCart, setIsAddingToCart] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(products.map((p) => [p.id, false]))
  );
  const { addToCart } = useCart();

  const increaseQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleAddToCart = async (product: Product) => {
    if (!product.isAvailable) return;

    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    await addToCart(product, quantities[product.id] || 1);
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
  };

  return (
    <div className="relative w-full mt-20 min-h-[80vh] overflow-hidden" ref={containerRef}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1575372030017-bda4288ebff1?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col lg:flex-row items-center justify-between gap-8 py-16 lg:py-20 px-4">
        {/* Left side - Text content */}
        <div className="w-full lg:w-1/2 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {products.map((product, index) => (
              <div key={product.id} className="w-full flex-shrink-0">
                <div className="space-y-6 lg:pr-8 bg-white/10 backdrop-blur-sm rounded-lg p-8">
                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-galindo"
                    variants={fadeInUp}
                  >
                    Naturalna
                    <br />
                    Woda Kokosowa <br />
                    Dr.Coco
                  </motion.h1>

                  <h2 className="text-2xl text-white/90">{product.name}</h2>
                  <p className="text-lg md:text-xl text-white/90 max-w-xl">{product.description}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-white/20"
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-lg">{quantities[product.id] || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-white/20"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <motion.div className="pt-4" variants={fadeInUp}>
                    <Button
                      size="lg"
                      className="rounded-full px-8 bg-white text-primary hover:bg-white/90"
                      onClick={() => handleAddToCart(product)}
                      disabled={isAddingToCart[product.id]}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {isAddingToCart[product.id] ? "Dodawanie..." : "Dodaj do koszyka"}
                    </Button>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-8 pt-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div className="text-center" variants={fadeInUp}>
                      <p className="text-3xl font-bold text-white font-galindo">100%</p>
                      <p className="text-white/80">Naturalne</p>
                    </motion.div>
                    <motion.div className="text-center" variants={fadeInUp}>
                      <p className="text-3xl font-bold text-white font-galindo">0g</p>
                      <p className="text-white/80">Cukru dodanego</p>
                    </motion.div>
                    <motion.div className="text-center" variants={fadeInUp}>
                      <p className="text-3xl font-bold text-white font-galindo">5</p>
                      <p className="text-white/80">Elektrolitów</p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-4">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Right side - Product Image */}
        <motion.div
          className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInRight}
        >
          <div className="relative w-full h-full lg:translate-x-12">
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
            className="absolute -z-10 w-96 h-96 rounded-full bg-white/10 blur-3xl right-1/3 top-1/3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.div
            className="absolute -z-10 w-64 h-64 rounded-full bg-white/10 blur-2xl left-1/2 bottom-1/4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
