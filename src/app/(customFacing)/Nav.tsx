"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from "react";
import { Menu, X, Instagram, Facebook, Twitter, Youtube, ShoppingCart, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Cart, { CartItem } from "./components/Cart";
import { NavIconButton } from "@/components/ui/nav-icon-button";
import { FeaturedProductCard } from "@/components/ui/FeaturedProductCard";

// Sample featured product data (in real app, this would come from API/database)
const sampleFeaturedProduct = {
  id: "featured-1",
  name: "Premium Coconut Oil",
  price: 49,
  priceInCents: 4900,
  imagePath: "/logo.png",
  description: "100% organic cold-pressed coconut oil for cooking, skincare and haircare.",
};

// NavLink for main buttons
function NavButton({
  href,
  children,
  onClick,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <Button
      variant="secondary"
      className={cn(
        "font-galindo text-3xl text-primary uppercase hover:rotate-3 transition-transform duration-300 ease-in-out shadow-none py-6 bg-transparent",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function Nav({ children }: { children: React.ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Load cart items
  useEffect(() => {
    const handleCartChange = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from localStorage:", e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    // Initial load
    handleCartChange();

    // Listen for changes to localStorage
    window.addEventListener("storage", handleCartChange);

    // Custom event for cart updates from same window
    window.addEventListener("cartUpdated", handleCartChange);

    return () => {
      window.removeEventListener("storage", handleCartChange);
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

  // Nav animation variants
  const navAnimation = {
    hidden: {
      y: -180,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Navbar slide variants for scroll-based visibility
  const navbarSlideVariants = {
    visible: {
      y: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
    hidden: {
      y: -180, // Not fully hidden, keeping logo partially visible
      transition: { duration: 0.5, ease: "easeOut" },
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
      const currentScrollY = window.scrollY;
      const scrollThreshold = 50;
      const hideThreshold = 420;

      // First threshold - change background
      const isScrolled = currentScrollY > scrollThreshold;
      setScrolled(isScrolled);

      // Second threshold - hide/show based on scroll direction or hover
      if (currentScrollY < scrollThreshold || hovering) {
        // Always show navbar when at the top or when hovering the logo
        setHidden(false);
      } else if (currentScrollY > prevScrollY + 10) {
        // Scrolling down past threshold - hide navbar
        if (currentScrollY > hideThreshold) {
          setHidden(true);
        }
      } else if (prevScrollY - currentScrollY > 10) {
        // Scrolling up - show navbar
        setHidden(false);
      }

      // Calculate scroll progress for animations (capped at 1)
      const maxScrollForAnimation = 250; // Adjust this value to control animation speed
      const progress = Math.min(currentScrollY / maxScrollForAnimation, 1);
      setScrollProgress(progress);

      // Update previous scroll position
      setPrevScrollY(currentScrollY);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY, hovering]);

  // Disable scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPanelOpen]);

  // Toggle panel open/closed
  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  // Close panel
  const closePanel = () => {
    setIsPanelOpen(false);
  };

  // Check if cart has items
  const hasCartItems = cartItems.length > 0;

  // Calculate total items for badge
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={cn(
          "text-primary-foreground sticky top-0 z-40 w-full px-72 py-2 transition-colors duration-300 h-32",
          scrolled ? "bg-background text-foreground" : "bg-transparent"
        )}
        initial="hidden"
        animate={isPanelOpen || hovering ? "visible" : hidden ? "hidden" : "visible"}
        variants={isPanelOpen ? navAnimation : navbarSlideVariants}
      >
        {/* Palm decorations - positioned relative to viewport, not just the navbar */}
        <div className="fixed inset-0 w-full pointer-events-none" style={{ height: "200vh" }}>
          {/* Right palm decoration */}
          <div
            className="absolute -right-40 -top-20 w-96 h-96 transition-all duration-1000 ease-out"
            style={{
              transform: `translateX(${scrollProgress * -100}px) translateY(${scrollProgress * 50}px) rotate(${scrollProgress * -15}deg)`,
              opacity: hidden && !hovering ? 0 : scrollProgress,
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
              opacity: hidden && !hovering ? 0 : scrollProgress,
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
          {/* Left - CTA Button with Cart Icon */}
          <div className="flex items-center gap-4">
            {/* Cart Icon - only show if cart has items */}
            {hasCartItems && (
              <NavIconButton
                icon={ShoppingCart}
                onClick={togglePanel}
                ariaLabel="Koszyk"
                isActive={isPanelOpen}
              />
            )}
            {/* Shop button */}
            <NavButton href="/shop"> Sklep</NavButton>
          </div>

          {/* Center - Logo */}
          <div
            ref={logoRef}
            className="absolute left-1/2 top-3/4 -translate-y-1/2 transform -translate-x-1/2 cursor-pointer"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={280}
                height={280}
                className={cn(
                  "object-contain size-64 bg-background/80 backdrop-blur-sm rounded-full transition-all duration-1000 ease-in-out border-primary",
                  hidden ? "border-b-2 " : ""
                )}
              />
            </Link>
          </div>

          {/* Right - Phone number and Burger Button */}
          <div className="flex items-center gap-4">
            {/* Phone number */}
            <NavButton href="tel:+48123456789" className="text-xl">
              <div className="flex items-center gap-2">
                <Phone className="size-6" strokeWidth={2.5} />
                <span>123 456 789</span>
              </div>
            </NavButton>

            {/* Burger Menu */}
            <NavIconButton
              icon={isPanelOpen ? X : Menu}
              onClick={togglePanel}
              ariaLabel="Menu główne"
              isActive={isPanelOpen}
            />
          </div>
        </div>
      </motion.nav>

      {/* Side Panel Overlay */}
      <div
        className={cn(
          "fixed left-0 right-0 z-20 bg-primary/30 backdrop-blur-sm transition-opacity duration-700 ease-in-out",
          isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
        onClick={closePanel}
      />

      {/* Side Panel - Menu */}
      <Card
        className={cn(
          "fixed right-0 z-30 w-80 py-0 transition-transform duration-300 ease-in-out overflow-y-auto bg-background shadow-none rounded-none flex flex-col",
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        <div className="p-6 space-y-6 flex-grow">
          {/* Featured Product */}
          <div className="mb-6">
            <h3 className="font-galindo text-xl text-primary mb-4">Polecany produkt</h3>
            <FeaturedProductCard
              product={sampleFeaturedProduct}
              onAddToCart={() => {
                // Add sample product to cart
                const newItem: CartItem = {
                  id: sampleFeaturedProduct.id,
                  name: sampleFeaturedProduct.name,
                  priceInCents: sampleFeaturedProduct.priceInCents,
                  quantity: 1,
                  imagePath: sampleFeaturedProduct.imagePath,
                };

                // Get existing cart
                const existingCart = localStorage.getItem("cart");
                let cart: CartItem[] = [];

                if (existingCart) {
                  try {
                    cart = JSON.parse(existingCart);

                    // Check if item already exists
                    const existingItemIndex = cart.findIndex((item) => item.id === newItem.id);
                    if (existingItemIndex >= 0) {
                      // Update quantity
                      cart[existingItemIndex].quantity += 1;
                    } else {
                      // Add new item
                      cart.push(newItem);
                    }
                  } catch (e) {
                    console.error("Failed to parse cart:", e);
                    cart = [newItem];
                  }
                } else {
                  cart = [newItem];
                }

                // Save cart
                localStorage.setItem("cart", JSON.stringify(cart));

                // Notify other components
                window.dispatchEvent(new Event("cartUpdated"));

                // Close panel
                closePanel();
              }}
            />
          </div>

          {/* Navigation Links */}
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

      {/* Cart Component */}
      <Cart
        isOpen={isPanelOpen}
        onClose={closePanel}
        navbarHeight={navbarHeight}
        onOpenCart={() => setIsPanelOpen(true)}
      />
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
