import { Faq } from "../components/Faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Dr.Coco",
  description:
    "Najczęściej zadawane pytania o wodzie kokosowej Dr.Coco. Dowiedz się wszystkiego o naszym naturalnym napoju.",
  alternates: {
    canonical: "https://drcoco.pl/faq",
  },
  openGraph: {
    title: "FAQ - Dr.Coco",
    description: "Najczęściej zadawane pytania o wodzie kokosowej Dr.Coco.",
    url: "https://drcoco.pl/faq",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <main>
        <Faq />
      </main>
    </div>
  );
}
