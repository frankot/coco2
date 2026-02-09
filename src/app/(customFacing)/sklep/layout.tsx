import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sklep - Woda kokosowa Dr.Coco",
  description:
    "Odkryj pełną gamę produktów Dr.Coco® - naturalna woda kokosowa z młodych kokosów. Sprawdź nasze oferty i zamów online z dostawą w całej Polsce.",
  alternates: {
    canonical: "https://drcoco.pl/sklep",
  },
  openGraph: {
    title: "Sklep Dr.Coco - Naturalna woda kokosowa",
    description:
      "Zamów naturalną wodę kokosową Dr.Coco® online. Bez cukru, bez konserwantów, wegańska. Dostawa w całej Polsce.",
    url: "https://drcoco.pl/sklep",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Sklep Dr.Coco - Produkty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sklep Dr.Coco - Naturalna woda kokosowa",
    description:
      "Zamów naturalną wodę kokosową Dr.Coco® online. Bez cukru, bez konserwantów, wegańska.",
    images: ["/og-image.webp"],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
