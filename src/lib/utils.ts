import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(priceInCents / 100);
}
