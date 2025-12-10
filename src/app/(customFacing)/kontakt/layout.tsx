import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr.Coco | Kontakt",
  description: "Skontaktuj się z nami. New Age Food Sp. z o.o. - ul. Modlińska 29a, 05-110 Jabłonna. Telefon: 798 865 865, Email: kontakt@drcoco.pl",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
