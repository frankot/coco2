import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z Dr.Coco® - New Age Food Sp. z o.o. Adres: ul. Modlińska 29a, 05-110 Jabłonna. Tel: 798 865 865, Email: kontakt@drcoco.pl. Obsługa pon-pt 9:00-17:00.",
  alternates: {
    canonical: "https://drcoco.pl/kontakt",
  },
  openGraph: {
    title: "Kontakt | Dr.Coco",
    description:
      "Skontaktuj się z Dr.Coco®. Telefon: 798 865 865, Email: kontakt@drcoco.pl. Odpowiadamy pon-pt 9:00-17:00.",
    url: "https://drcoco.pl/kontakt",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Kontakt | Dr.Coco",
    description:
      "Skontaktuj się z Dr.Coco®. Telefon: 798 865 865, Email: kontakt@drcoco.pl.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
