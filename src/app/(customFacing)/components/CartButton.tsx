"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CartButtonProps {
  onClick: () => void;
  itemCount: number;
  className?: string;
  variant?: "ghost" | "floating";
}

export function CartButton({ onClick, itemCount, className, variant = "ghost" }: CartButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "floating") return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setHasScrolled(scrolled);
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  if (itemCount === 0) return null;
  if (variant === "floating" && !hasScrolled) return null;

  const baseButton = (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={cn(
          className,
          variant === "floating" &&
            "bg-white hover:bg-white/90 text-foreground shadow-md rounded-full h-14 w-14"
        )}
      >
        <ShoppingCart className={cn("size-7")} />
        <span
          className={cn(
            "absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center",
            variant === "floating" && "bg-primary text-white"
          )}
        >
          {itemCount}
        </span>
      </Button>
    </div>
  );

  if (variant === "floating") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            {baseButton}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return baseButton;
}
