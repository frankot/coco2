import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr.Coco | Produkty",
  description: "Odkryj pełną gamę produktów Dr.Coco - naturalna woda kokosowa z młodych kokosów. Sprawdź nasze oferty i zamów online.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
