"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type PalmDecorationsProps = {
  hidden: boolean;
  hovering: boolean;
};

// Memoize the component to avoid unnecessary re-renders
export const PalmDecorations = memo(function PalmDecorations({
  hidden,
  hovering,
}: PalmDecorationsProps) {
  const [animationPlayed, setAnimationPlayed] = useState(false);

  // Track if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      // Only trigger once when first scrolled
      if (!animationPlayed && window.scrollY > 50) {
        setAnimationPlayed(true);
        // Remove listener after animation is triggered
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animationPlayed]);

  // Determine opacity based on whether animation has played and navbar state
  // Always 0 before first scroll (animationPlayed === false)
  const opacity = !animationPlayed ? 0 : hidden && !hovering ? 0 : 1;

  return (
    <div className="fixed inset-0 w-full pointer-events-none" style={{ height: "200vh" }}>
      {/* Right palm decoration */}
      <AnimatePresence>
        <motion.div
          className="absolute -right-40 -top-20 w-96 h-96 will-change-transform"
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            x: animationPlayed ? -100 : 0,
            y: animationPlayed ? 50 : 0,
            rotate: animationPlayed ? -15 : 0,
            opacity,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        >
          <Image
            src="/palmy-prawa.png"
            alt="Palm decoration"
            width={600}
            height={600}
            className="object-contain"
            priority={true}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left palm decoration (flipped version of the right one) */}
      <AnimatePresence>
        <motion.div
          className="absolute -left-40 -top-20 w-96 h-96 will-change-transform"
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
            scaleX: -1,
          }}
          animate={{
            x: animationPlayed ? 100 : 0,
            y: animationPlayed ? 50 : 0,
            rotate: animationPlayed ? 15 : 0,
            opacity,
            scaleX: -1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        >
          <Image
            src="/palmy-prawa.png"
            alt="Palm decoration"
            width={600}
            height={600}
            className="object-contain"
            priority={true}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
