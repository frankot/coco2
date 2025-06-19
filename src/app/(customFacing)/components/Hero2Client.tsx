"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, Plus, Minus, Leaf, Droplet, Sparkles, Heart, Ban, Award } from "lucide-react";
import { useCart } from "./Cart";
import { formatPLN } from "@/lib/formatter";

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  isAvailable: boolean;
};

interface Hero2ClientProps {
  products: Product[];
}

const features = [
  { icon: Leaf, text: "100% Naturalne" },
  { icon: Droplet, text: "Zero Cukru" },
  { icon: Sparkles, text: "Bez GMO" },
  { icon: Heart, text: "Wegańskie" },
  { icon: Ban, text: "Bez Konserwantów" },
  { icon: Award, text: "Laureat Nobla" },
];

export function Hero2Client({ products }: Hero2ClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      x: [0, -1035],
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [controls]);

  const handleAddToCart = async (product: Product) => {
    if (!product.isAvailable) return;
    await addToCart(product, quantity);
    setQuantity(1);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="bg-primary relative">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="text-yellow-300 text-sm font-medium tracking-wider uppercase">
                WITAJ W DR.COCO®
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight font-galindo">
                Naturalna Woda
                <br />z Młodych Kokosów
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                30 lat doświadczenia w produkcji najwyższej jakości wody kokosowej. 100% naturalna,
                bez dodatku cukru.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4 ">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center justify-center p-3 group"
                >
                  <feature.icon className="size-10 text-yellow-300 mb-2 group-hover:scale-110 transition-all duration-300" />
                  <span className="text-sm text-white/90 text-center">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Content - Product Display */}
          <div className="relative   backdrop-blur-sm rounded-2xl p-8  border-white/10">
            <div className="relative h-[400px] mb-6">
              <Image
                src={products[currentSlide].imagePath}
                alt={products[currentSlide].name}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl text-white font-medium">{products[currentSlide].name}</h2>
                <p className="text-sm text-white/70 mt-1">(w paczkach po 12 szt.)</p>
              </div>

              <div className="flex items-center justify-between gap-4 bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/20"
                    onClick={decreaseQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-lg font-medium min-w-[2ch] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/20"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-white">
                    {formatPLN(products[currentSlide].priceInCents * quantity)}
                  </div>
                  <Button
                    className="bg-yellow-300 text-primary hover:bg-yellow-400"
                    onClick={() => handleAddToCart(products[currentSlide])}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Do koszyka
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {products.slice(0, 2).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-8 rounded-full transition-colors ${
                    currentSlide === index ? "bg-yellow-300" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Carousel Text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-yellow-300">
        <div className="relative flex py-3">
          <motion.div className="whitespace-nowrap" animate={controls}>
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="text-2xl font-galindo text-primary">
                Nowy smak! <span className="mx-8">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
