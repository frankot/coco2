"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CartPriceRefresher() {
  const { data: session, status } = useSession();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

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

  useEffect(() => {
    if (status === "loading") return;
    const currentUserId = session?.user?.id ?? null;
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;
      refreshCartPrices();
      return;
    }
    if (prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId;
      refreshCartPrices();
    }
  }, [session?.user?.id, status, refreshCartPrices]);

  return null;
}

export function MobileAccountSection({ onLinkClick }: { onLinkClick?: () => void }) {
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

export function DesktopAuthGreeting() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  return (
    <span className="text-sm text-muted-foreground whitespace-nowrap">
      Witaj, {session?.user?.name?.split(" ")[0] || "Uzytkowniku"}
    </span>
  );
}

export function DesktopAuthMenu() {
  const { status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";
  const onAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/uzytkownik");

  if (!isAuthenticated) {
    return (
      <Link href="/auth/zaloguj">
        <Button variant="ghost" size="icon" aria-label="Zaloguj się lub otwórz konto użytkownika">
          <User className={cn("size-7", onAuthPage && "text-primary")} />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Otwórz menu konta użytkownika">
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
