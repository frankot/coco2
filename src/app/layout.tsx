import type { Metadata } from "next";
import Script from "next/script";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { LazyToaster } from "@/components/LazyToaster";

const GTM_ID = "GTM-MQ3CND2M";

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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
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
        {/* GTM: dataLayer init + consent defaults + gtm.start — must run BEFORE gtm.js */}
        <Script id="gtm-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
          `}
        </Script>
      </head>
      <body
        className={`${outfit.variable} font-outfit min-h-screen antialiased bg-white scroll-smooth`}
      >
        {/* GTM noscript — right after <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* GTM external script — afterInteractive, dataLayer is already primed */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
        <SessionProvider>{children}</SessionProvider>
        <LazyToaster />
      </body>
    </html>
  );
}
