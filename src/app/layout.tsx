import type { Metadata } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});


const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drcoco.pl"),
  title: {
    default: "Dr.Coco - Naturalna woda kokosowa z młodych kokosów",
    template: "%s | Dr.Coco",
  },
  description:
    "Dr.Coco® to naturalny izotonik - woda kokosowa z organicznych farm w Wietnamie. Bez cukru, bez konserwantów, wegańska, bezglutenowa. Zamów online z dostawą w całej Polsce.",
  keywords: [
    "woda kokosowa",
    "Dr.Coco",
    "naturalny izotonik",
    "zdrowe napoje",
    "woda kokosowa Wietnam",
    "woda kokosowa z młodych kokosów",
    "napój kokosowy",
    "izotonik naturalny",
    "woda kokosowa bez cukru",
    "napój wegański",
  ],
  authors: [{ name: "New Age Food Sp. z o.o." }],
  creator: "Dr.Coco",
  publisher: "New Age Food Sp. z o.o.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://drcoco.pl",
    siteName: "Dr.Coco",
    title: "Dr.Coco - Naturalna woda kokosowa z młodych kokosów",
    description:
      "Dr.Coco® to naturalny izotonik - woda kokosowa z organicznych farm w Wietnamie. Bez cukru, bez konserwantów, wegańska. Zamów online.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Dr.Coco - Naturalna woda kokosowa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr.Coco - Naturalna woda kokosowa z młodych kokosów",
    description:
      "Dr.Coco® to naturalny izotonik - woda kokosowa z organicznych farm w Wietnamie. Bez cukru, bez konserwantów, wegańska.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://drcoco.pl",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Preload critical images */}
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body
        className={`${geistSans.variable}  ${outfit.variable} font-outfit min-h-screen antialiased bg-white scroll-smooth`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
          theme="light"
          style={
            {
              "--normal-bg": "hsl(var(--background))",
              "--normal-border": "1px solid hsl(var(--primary))",
              "--normal-text": "hsl(var(--foreground))",
            } as React.CSSProperties
          }
        />
      </body>
    </html>
  );
}
