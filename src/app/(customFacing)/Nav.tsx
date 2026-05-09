"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from "react";
import { Menu, User, Instagram, Facebook, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartSheet } from "./components/CartSheet";
import { CartButton } from "./components/CartButton";

type CartItem = {
  id: string;
  quantity: number;
};

// Custom event type for cart updates
declare global {
  interface WindowEventMap {
    cartUpdated: CustomEvent;
  }
}

// Mobile Account Section component
function MobileAccountSection({ onLinkClick }: { onLinkClick?: () => void }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground px-4">Konto</p>
        <Link
          href="/auth/zaloguj"
          className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md transition-colors"
          onClick={onLinkClick}
        >
          <User className="size-5" />
          <span>Zaloguj się</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground px-4">
        Witaj, {session?.user?.name?.split(" ")[0] || "Użytkowniku"}
      </p>
      <Link
        href="/uzytkownik"
        className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md transition-colors"
        onClick={onLinkClick}
      >
        <User className="size-5" />
        <span>Mój profil</span>
      </Link>
      <Link
        href={{ pathname: "/uzytkownik", query: { tab: "orders" } }}
        className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md transition-colors"
        onClick={onLinkClick}
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <span>Moje zamówienia</span>
      </Link>
      <button
        onClick={() => {
          signOut({ callbackUrl: "/" });
          onLinkClick?.();
        }}
        className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md transition-colors w-full text-left"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Wyloguj się</span>
      </button>
    </div>
  );
}

// User Account Menu component
function UserAccountMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";
  const onAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/uzytkownik");

  if (!isAuthenticated) {
    return (
      <Link href="/auth/zaloguj">
        <Button variant="ghost" size="icon">
          <User className={cn("size-7", onAuthPage && "text-primary")} />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className={cn("size-7", onAuthPage && "text-primary")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-stone-200/60">
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/uzytkownik">Profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={{ pathname: "/uzytkownik", query: { tab: "orders" } }}>Zamówienia</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Wyloguj</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type NavItemData =
  | { type: "link"; href: string; label: string }
  | { type: "dropdown"; label: string; items: { href: string; label: string }[] };

// Mobile accordion — no Radix portals, no sheet close on expand
function MobileNavAccordion({
  items,
  onLinkClick,
}: {
  items: NavItemData[];
  onLinkClick: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-1">
      {items.map((item) => {
        if (item.type === "link") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2.5 rounded-md transition-colors text-base",
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:bg-accent"
              )}
              onClick={onLinkClick}
            >
              {item.label}
            </Link>
          );
        }

        const isOpen = openDropdown === item.label;
        const isActive = item.items.some((sub) => pathname === sub.href);

        return (
          <div key={item.label}>
            <button
              onClick={() => setOpenDropdown(isOpen ? null : item.label)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-2.5 rounded-md transition-colors text-base",
                isActive ? "text-primary font-medium" : "text-gray-700 hover:bg-accent"
              )}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="ml-4 mt-1 mb-1 flex flex-col space-y-0.5 border-l-2 border-primary/20 pl-3">
                {item.items.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md transition-colors text-sm",
                      pathname === sub.href
                        ? "text-primary font-medium"
                        : "text-gray-600 hover:bg-accent"
                    )}
                    onClick={onLinkClick}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Nav({ children, navItems }: { children: React.ReactNode; navItems?: NavItemData[] }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  // Check if we're on the main page
  const isMainPage = pathname === "/";

  // Refresh cart prices from /api/products (returns auth-aware prices)
  const refreshCartPrices = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) return;

    fetch("/api/products")
      .then((r) => r.json())
      .then((products: { id: string; priceInCents: number }[]) => {
        const priceMap = new Map(products.map((p) => [p.id, p.priceInCents]));
        const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
        let changed = false;
        const updated = currentCart.map((item: any) => {
          const freshPrice = priceMap.get(item.id);
          if (freshPrice !== undefined && freshPrice !== item.priceInCents) {
            changed = true;
            return { ...item, priceInCents: freshPrice };
          }
          return item;
        });
        if (changed) {
          localStorage.setItem("cart", JSON.stringify(updated));
          window.dispatchEvent(new Event("cartUpdated"));
        }
      })
      .catch(() => {});
  }, []);

  // Refresh cart prices when auth state changes (login/logout/page load)
  useEffect(() => {
    if (status === "loading") return;
    const currentUserId = session?.user?.id ?? null;
    if (prevUserIdRef.current === undefined) {
      // First load — refresh to sync prices with current auth state
      prevUserIdRef.current = currentUserId;
      refreshCartPrices();
      return;
    }
    if (prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId;
      refreshCartPrices();
    }
  }, [session?.user?.id, status, refreshCartPrices]);

  // Load cart items
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (e) {
        console.error("Failed to parse cart:", e);
        setCartItems([]);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCart();
      }
    };

    const handleCartUpdate = () => {
      loadCart();
    };

    const handleOpenCartSheet = () => {
      setIsCartOpen(true);
    };

    // Initial load
    loadCart();

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("openCartSheet", handleOpenCartSheet);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("openCartSheet", handleOpenCartSheet);
    };
  }, []);

  // Handle scroll for logo animation (only on main page)
  useEffect(() => {
    if (!isMainPage) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainPage]);

  const cartItemCount = cartItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  // Simplified logo sizing - use same height for consistency
  const maxScroll = 150;
  const scrollProgress = isMainPage ? Math.min(scrollY / maxScroll, 1) : 1;
  const logoMarginTop = isMainPage ? 46 - scrollProgress * 46 : 0;
  const logoPadding = isMainPage ? 8 - scrollProgress * 8 : 0;

  const logoHeightPx = isMainPage ? 100 - scrollProgress * 20 : 80;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-full fixed top-0 left-0 right-0 z-50 py-2 bg-stone-50 border-b border-stone-200/50 shadow-xs lg:mb-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-16 ">
          <div className="flex h-14 items-center">
            {/* Left side - Navigation */}
            <div className="flex-1 flex items-center space-x-8">{children}</div>

            {/* Center - Logo */}
            <div
              className="flex-shrink-0 overflow-visible z-20 transition-all duration-300 ease-out"
              style={{
                marginTop: `${logoMarginTop}px`,
                transformOrigin: "center",
                borderRadius: "50%",
                backgroundColor:
                  isMainPage && scrollProgress < 1 ? "rgb(250 250 249)" : "transparent",
                padding: `${logoPadding}px`,
              }}
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={144}
                  height={144}
                  priority
                  className="w-auto transition-all duration-300 ease-out"
                  style={{ height: `${logoHeightPx}px` }}
                />
              </Link>
            </div>

            {/* Right side - Cart & Account */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              {status === "authenticated" && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Witaj, {session?.user?.name?.split(" ")[0] || "Uzytkowniku"}
                </span>
              )}
              <CartButton onClick={() => setIsCartOpen(true)} itemCount={cartItemCount} />
              <UserAccountMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden relative w-full bg-stone-50 border-b border-stone-200/50 shadow-xs overflow-hidden">
        <div className="flex h-20 items-center justify-between px-4">
          {/* Left — Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
              <SheetDescription className="sr-only">
                Nawigacja po sklepie Dr.Coco
              </SheetDescription>
              <nav className="flex flex-col mt-8 flex-1">
                {navItems ? (
                  <MobileNavAccordion
                    items={navItems}
                    onLinkClick={() => setIsMobileMenuOpen(false)}
                  />
                ) : (
                  <div
                    className="flex flex-col space-y-1"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a")) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {children}
                  </div>
                )}

                {/* Mobile Account Section */}
                <div className="pt-4 border-t">
                  <MobileAccountSection onLinkClick={() => setIsMobileMenuOpen(false)} />
                </div>
              </nav>
              <div className="flex flex-col items-center gap-6 pb-8">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={160}
                    height={160}
                    className="h-44 w-auto opacity-80"
                  />
                </Link>

                <div className="flex items-center gap-4">
                  <Link
                    href="https://instagram.com/drcoco"
                    target="_blank"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Instagram className="h-7 w-7" />
                  </Link>
                  <Link
                    href="https://facebook.com/drcoco"
                    target="_blank"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Facebook className="h-7 w-7" />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Center — Logo */}
          <div
            className="absolute left-1/2 -translate-x-1/2 mt-2 overflow-hidden z-20"
            style={{
              borderRadius: "50%",
              backgroundColor: "rgb(250 250 249)",
              padding: "3px",
            }}
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={144}
                height={144}
                priority
                className="w-auto"
                style={{ height: "80px" }}
              />
            </Link>
          </div>

          {/* Right — Cart */}
          <div className="flex items-center gap-2 ml-auto">
            <CartButton onClick={() => setIsCartOpen(true)} itemCount={cartItemCount} />
          </div>
        </div>
      </nav>

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "text-base font-medium hover:text-primary transition-colors",
        pathname === props.href && "text-primary"
      )}
    />
  );
}

interface NavDropdownItem {
  href: string;
  label: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const pathname = usePathname();
  const isActive = items.some((item) => pathname === item.href);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "text-base font-medium hover:text-primary transition-colors inline-flex items-center gap-1 outline-none focus-visible:outline-none",
            isActive && "text-primary"
          )}
        >
          {label}
          <ChevronDown className="size-3.5 mt-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="border-stone-200/60">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
