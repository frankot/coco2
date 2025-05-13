"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from "react";
import { Menu, X, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function Nav({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  // Nav animation variants
  const navAnimation = {
    hidden: {
      y: -120,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  // Measure navbar height for proper side panel positioning
  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        setNavbarHeight(height);
        console.log("Navbar height:", height);
      }
    };

    // Update on mount and on window resize
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  // Handle scroll events to change navbar appearance and animate decorations
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      const isScrolled = window.scrollY > scrollThreshold;
      setScrolled(isScrolled);

      // Calculate scroll progress for animations (capped at 1)
      const maxScrollForAnimation = 250; // Adjust this value to control animation speed
      const progress = Math.min(window.scrollY / maxScrollForAnimation, 1);
      setScrollProgress(progress);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={cn(
          "text-primary-foreground sticky top-0 z-30 w-full px-72 py-2 transition-colors duration-300 h-32",
          scrolled ? "bg-background text-foreground" : "bg-transparent"
        )}
        initial="hidden"
        animate="visible"
        variants={navAnimation}
      >
        {/* Palm decorations - positioned relative to viewport, not just the navbar */}
        <div className="fixed inset-0 w-full pointer-events-none" style={{ height: "200vh" }}>
          {/* Right palm decoration */}
          <div
            className="absolute -right-40 -top-20 w-96 h-96 transition-all duration-1000 ease-out"
            style={{
              transform: `translateX(${scrollProgress * -100}px) translateY(${scrollProgress * 50}px) rotate(${scrollProgress * -15}deg)`,
              opacity: scrollProgress,
            }}
          >
            <Image
              src="/palmy-prawa.png"
              alt="Palm decoration"
              width={600}
              height={600}
              className="object-contain"
            />
          </div>

          {/* Left palm decoration (flipped version of the right one) */}
          <div
            className="absolute -left-40 -top-20 w-96 h-96 transition-all duration-1000 ease-out"
            style={{
              transform: `translateX(${scrollProgress * 100}px) translateY(${scrollProgress * 50}px) rotate(${scrollProgress * 15}deg) scaleX(-1)`,
              opacity: scrollProgress,
            }}
          >
            <Image
              src="/palmy-prawa.png"
              alt="Palm decoration"
              width={600}
              height={600}
              className="object-contain "
            />
          </div>
        </div>

        <div className="container mx-auto flex items-center justify-between h-full relative z-10">
          {/* Left - CTA Button */}
          <Button
            asChild
            variant="secondary"
            className="font-galindo text-3xl text-primary uppercase hover:rotate-12 transition-transform duration-300 ease-in-out shadow-none  py-6 bg-transparent "
          >
            <Link href="/shop" className="">
              Sklep
            </Link>
          </Button>

          {/* Center - Logo */}
          <div className="absolute left-1/2 top-3/4 -translate-y-1/2 transform -translate-x-1/2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={280}
                height={280}
                className="object-contain size-64 bg-background/80 backdrop-blur-sm rounded-full"
              />
            </Link>
          </div>

          {/* Right - Burger Button */}
          <Button
            className="size-20 text-secondary"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="size-14" /> : <Menu className="size-14" />}
          </Button>
        </div>
      </motion.nav>

      {/* Side Panel Overlay */}
      <div
        className={cn(
          "fixed left-0 right-0 z-20 bg-primary/30 backdrop-blur-sm transition-opacity duration-700 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Panel */}
      <Card
        className={cn(
          "fixed right-0 z-20 w-80 py-0 transition-transform duration-300 ease-in-out overflow-y-auto bg-background shadow-none rounded-none flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        <div className="p-6 space-y-6 flex-grow">
          <div></div>
          <div className="space-y-2">{children}</div>
        </div>

        {/* Social Media Icons */}
        <div className="p-6 border-t border-secondary/20">
          <div className="flex justify-center gap-6">
            <Link
              href="https://instagram.com/dr.coco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="size-8" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="size-8" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="size-8" />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="size-8" />
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "block w-full p-3 rounded-md font-galindo text-3xl hover:bg-secondary text-primary transition-colors",
        pathname === props.href && "bg-primary text-secondary-foreground"
      )}
    />
  );
}
