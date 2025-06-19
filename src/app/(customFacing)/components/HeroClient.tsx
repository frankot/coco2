"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  Leaf,
  Droplet,
  Sparkles,
  Heart,
  Ban,
  Award,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/app/(customFacing)/components/Cart";
import { formatPLN } from "@/lib/formatter";

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  isAvailable: boolean;
};

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

// Features array
const features = [
  "100% Naturalne",
  "Bez dodatku cukru",
  "Bogate w elektrolity",
  "Świeży smak",
  "Wegańskie",
  "Bez GMO",
  "Bez konserwantów",
  "Źródło potasu",
  "Niskokaloryczne",
  "Orzeźwiające",
];

// Product features with icons
const productFeatures = [
  { icon: Leaf, text: "100% Wegańskie" },
  { icon: Droplet, text: "Zero Cukru" },
  { icon: Sparkles, text: "Naturalne" },
  { icon: Heart, text: "Zdrowe" },
  { icon: Ban, text: "Bez GMO" },
  { icon: Award, text: "Jakość" },
];

// Key product points
const keyPoints = [
  { icon: Leaf, text: "100% Naturalne" },
  { icon: Droplet, text: "Zero Cukru" },
  { icon: ShieldCheck, text: "Bez GMO" },
  { icon: Heart, text: "Wegańskie" },
];

export function HeroClient({ products }: HeroClientProps) {
  const containerRef = useRef(null);
  const featuresContainerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(products.map((p) => [p.id, 1]))
  );
  const [isAddingToCart, setIsAddingToCart] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(products.map((p) => [p.id, false]))
  );
  const { addToCart } = useCart();

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Enhanced spring animation for smoother scrolling
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]), springConfig);

  // Product card spring animation
  const cardSpring = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  // Image spring animation
  const imageSpring = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
        delay: 0.2,
      },
    },
  };

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
    <div className="relative w-full min-h-[80vh] overflow-hidden" ref={containerRef}>
      {/* Features slider */}
      <div className="absolute bottom-0 z-30 mt-8 overflow-hidden" ref={featuresContainerRef}>
        <motion.div className="flex gap-16 whitespace-nowrap py-4" style={{ x }}>
          {features.concat(features).map((feature, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center px-6 py-2 bg-white/10 backdrop-blur-sm  text-2xl font-galindo rounded-full text-white/90 font-medium"
            >
              {feature}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video className="h-full w-full object-cover" autoPlay playsInline muted loop>
          <source
            src="https://res.cloudinary.com/dxdjxuxeu/video/upload/f_auto:video,q_auto/v1/coco-vid/oszzngaidbkomei6bhkk"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col lg:flex-row items-start justify-between gap-8 py-16 lg:py-20 px-4">
        {/* Left side - Text content */}
        <div className="w-full lg:w-1/2 overflow-hidden">
          <div className="space-y-6 lg:pr-8 bg-stone-50/15 backdrop-blur-xs shadow-xl rounded-lg p-8 border border-primary/50">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-galindo"
              variants={fadeInUp}
            >
              Naturalna
              <br />
              Woda Kokosowa <br />
              Dr.Coco
            </motion.h1>

            <p className="text-lg md:text-xl text-white/90 line-clamp-5 max-w-xl">
              Dr Coco to w pełni naturalna woda kokosowa, produkowana z najwyższej jakości młodych
              kokosów. Nasz przepyszna woda ma również cudowne właściwości, jest uznawana za
              najlepszy naturalny izotonik. Dodatkowo wzmocni twój organizm dawka minerałów i
              witamin.
            </p>

            {/* Key Points Row */}
            <div className="flex justify-between items-center gap-4 py-4">
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-full p-3 mb-2">
                    <point.icon className="size-10 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-white/90">{point.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Product Image and Cart Card */}
        <div className="w-full lg:w-1/2 relative flex flex-col gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="w-full relative h-[500px] flex flex-col items-start justify-center"
              initial="initial"
              animate={currentSlide === index ? "animate" : "initial"}
              variants={cardSpring}
              style={{ display: currentSlide === index ? "block" : "none" }}
            >
              {/* Product Image */}
              <motion.div
                className="relative h-full w-full flex justify-center"
                variants={imageSpring}
              >
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain drop-shadow-2xl hover:scale-105 hover:rotate-2 transition-all duration-300"
                />
              </motion.div>

              {/* Cart Card */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/10 translate-y-2/3 border border-primary/50 backdrop-blur-sm rounded-lg p-6 w-[480px] max-w-[90%]">
                <h2 className="text-2xl text-center text-white/90 font-galindo">{product.name}</h2>
                <p className="text-sm text-center text-white/80 mb-4">(w paczkach po 12 szt.)</p>
                <div className="flex items-center justify-between gap-4">
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

                  <div className="text-xl font-bold text-white">
                    {formatPLN(product.priceInCents * (quantities[product.id] || 1))}
                  </div>

                  <Button
                    size="lg"
                    className="rounded-full px-8 bg-white text-primary hover:bg-white/90"
                    onClick={() => handleAddToCart(product)}
                    disabled={isAddingToCart[product.id]}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {isAddingToCart[product.id] ? "Dodawanie..." : "Dodaj do koszyka"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Vertical Dots navigation */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pr-4">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-12 rounded-full transition-colors border border-stone-200/50 ${
                  currentSlide === index ? "bg-white" : "bg-primary/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
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
        </div>
      </div>
    </div>
  );
}
