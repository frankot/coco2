"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from "react";
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ShoppingCart,
  Phone,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Cart, { CartItem } from "./components/Cart";
import { NavIconButton } from "@/components/ui/nav-icon-button";
import { FeaturedProductCard } from "@/components/ui/FeaturedProductCard";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample featured product data
const sampleFeaturedProduct = {
  id: "featured-1",
  name: "Premium Coconut Oil",
  price: 49,
  priceInCents: 4900,
  imagePath: "/logo.png",
  description: "100% organic cold-pressed coconut oil for cooking, skincare and haircare.",
};

// NavLink button component
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
      variant="ghost"
      className={cn(
        "font-medium text-lg text-primary hover:bg-primary/10 transition-all duration-200",
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

// User Account Menu component
function UserAccountMenu() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // If loading, show nothing
  if (isLoading) return null;

  // If not authenticated, show login link
  if (!isAuthenticated) {
    return (
      <NavButton href="/auth/zaloguj" className="text-primary">
        <div className="flex items-center gap-2">
          <User className="size-4" strokeWidth={2} />
          <span>Zaloguj</span>
        </div>
      </NavButton>
    );
  }

  // If authenticated, show user dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 font-medium text-primary hover:bg-primary/10"
        >
          <User className="size-4" strokeWidth={2} />
          <span>{session.user?.name || "Użytkownik"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/user/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="size-4" />
            <span>Ustawienia</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-destructive"
        >
          <div className="flex items-center gap-2">
            <LogOut className="size-4" />
            <span>Wyloguj</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Nav({ children }: { children: React.ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(80);
  const pathname = usePathname();

  // Load cart items
  useEffect(() => {
    const handleCartChange = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
        setCartItems([]);
      }
    };

    // Initial load
    handleCartChange();

    window.addEventListener("storage", handleCartChange);
    window.addEventListener("cartUpdated", handleCartChange);

    return () => {
      window.removeEventListener("storage", handleCartChange);
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Update on mount
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure navbar height
  useEffect(() => {
    if (navRef.current) {
      const height = navRef.current.offsetHeight;
      setNavbarHeight(height);
    }

    const updateHeight = () => {
      if (navRef.current) {
        setNavbarHeight(navRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Disable body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPanelOpen]);

  // Derived values
  const hasCartItems = cartItems.length > 0;
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Event handlers
  const togglePanel = () => setIsPanelOpen((prev) => !prev);
  const closePanel = () => setIsPanelOpen(false);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-200",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-primary/10 shadow-sm"
            : "bg-background border-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo */}
            <div className="flex items-center">
              <Link href="/" className="mr-6">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="transition-transform hover:scale-105 rounded-full"
                />
              </Link>
              <NavButton href="/shop">Sklep</NavButton>
            </div>

            {/* Center section - empty for now */}
            <div className="hidden md:flex"></div>

            {/* Right section - Contact, Cart, User, Menu */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Contact */}
              <NavButton href="tel:+48123456789" className="hidden md:flex">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" strokeWidth={2} />
                  <span className="hidden lg:inline">123 456 789</span>
                </div>
              </NavButton>

              {/* Cart - only show if items exist */}
              {hasCartItems && (
                <div className="relative">
                  <NavIconButton
                    icon={ShoppingCart}
                    onClick={togglePanel}
                    ariaLabel="Koszyk"
                    isActive={isPanelOpen}
                    className="size-9"
                  />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                </div>
              )}

              {/* User Account Menu */}
              <UserAccountMenu />

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <NavIconButton
                  icon={isPanelOpen ? X : Menu}
                  onClick={togglePanel}
                  ariaLabel="Menu główne"
                  isActive={isPanelOpen}
                  className="size-9"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Panel Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${navbarHeight}px` }}
        onClick={closePanel}
      />

      {/* Side Panel Menu */}
      <Card
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-[280px] overflow-y-auto border-l bg-background transition-transform duration-300 ease-in-out",
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: `${navbarHeight}px`, height: `calc(100vh - ${navbarHeight}px)` }}
      >
        <div className="flex flex-col h-full">
          {/* Main content area */}
          <div className="flex-grow p-4 space-y-6">
            {/* Mobile Nav Links */}
            <div className="space-y-1">{children}</div>

            {/* Login/Account Info (Mobile) */}
            <div className="my-4 py-4 border-t border-b border-primary/10">
              {(() => {
                const { data: session, status } = useSession();
                if (status === "loading") return null;

                if (status === "authenticated") {
                  return (
                    <div className="space-y-3">
                      <div className="font-medium text-lg">
                        {session.user?.name || "Użytkownik"}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/user/settings"
                          className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                        >
                          <Settings className="size-4" />
                          <span>Ustawienia</span>
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-2 p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors text-left"
                        >
                          <LogOut className="size-4" />
                          <span>Wyloguj</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    href="/auth/zaloguj"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <User className="size-5" />
                    <span className="font-medium">Zaloguj się</span>
                  </Link>
                );
              })()}
            </div>

            {/* Featured Product */}
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
                    const existingItemIndex = cart.findIndex((item) => item.id === newItem.id);
                    if (existingItemIndex >= 0) {
                      cart[existingItemIndex].quantity += 1;
                    } else {
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
                window.dispatchEvent(new Event("cartUpdated"));
                closePanel();
              }}
            />
          </div>

          {/* Social Media Footer */}
          <div className="p-4 border-t border-primary/10">
            <div className="flex justify-center gap-4">
              <Link
                href="https://instagram.com/dr.coco"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="size-5" />
              </Link>
            </div>
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
        "block w-full px-3 py-2 rounded-md font-medium text-base hover:bg-accent transition-colors",
        pathname === props.href && "bg-primary text-primary-foreground"
      )}
    />
  );
}
