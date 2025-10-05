"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from "react";
import { Menu, User, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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

// User Account Menu component
function UserAccountMenu() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    return (
      <Link href="/auth/zaloguj">
        <Button variant="ghost" size="icon">
          <User className="size-7" />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="size-7" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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

export function Nav({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  // Check if we're on the main page
  const isMainPage = pathname === "/";

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
  const logoMarginTop = isMainPage ? 48 - scrollProgress * 48 : 0;
  const logoPadding = isMainPage ? 8 - scrollProgress * 8 : 0;

  // Use same height class for both states to ensure consistency
  const logoHeight = isMainPage && scrollProgress < 1 ? "h-36" : "h-20";

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-full fixed top-0 left-0 right-0 z-50 py-2 bg-stone-50 border-b border-gray-200 shadow-xs ">
        <div className="container mx-auto max-w-7xl px-4 ">
          <div className="flex h-14 items-center">
            {/* Left side - Navigation */}
            <div className="flex-1 flex items-center space-x-8">{children}</div>

            {/* Center - Logo */}
            <div
              className="flex-shrink-0 overflow-visible z-20 transition-all duration-300 ease-out"
              style={{
                marginTop: `${logoMarginTop}px`,
                transformOrigin: "center",
                borderRadius: `${isMainPage && scrollProgress < 1 ? "50%" : "0"}`,
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
                  className={`w-auto transition-all duration-300 ease-out ${logoHeight}`}
                />
              </Link>
            </div>

            {/* Right side - Cart & Account */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              <CartButton onClick={() => setIsCartOpen(true)} itemCount={cartItemCount} />
              <UserAccountMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="">
                <Menu className="size-6 " />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8 flex-1">{children}</nav>
              <div className="flex flex-col items-center gap-6 pb-8">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={160}
                  className="h-44 w-auto opacity-80"
                />
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

          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="h-20 mt-4 w-auto"
            />
          </Link>

          <div className="flex items-center">
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
