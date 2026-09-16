import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { LazyToaster } from "@/components/LazyToaster";
import { COOKIE_CONSENT_KEY, GTM_ID } from "@/lib/analytics";

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
        {/* dataLayer + Consent Mode defaults — must run before gtm.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
try {
  var c = localStorage.getItem('${COOKIE_CONSENT_KEY}');
  if (c === 'accepted' || c === 'rejected') {
    var v = c === 'accepted' ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: v,
      analytics_storage: v,
      ad_user_data: v,
      ad_personalization: v
    });
  }
} catch (e) {}
`,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* Preload critical images */}
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body
        className={`${outfit.variable} font-outfit min-h-screen antialiased bg-white scroll-smooth`}
      >
        {/* Google Tag Manager (noscript) — first element in <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SessionProvider>{children}</SessionProvider>
        <LazyToaster />
      </body>
    </html>
  );
}
