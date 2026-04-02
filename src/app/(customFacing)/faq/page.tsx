import type { Metadata } from "next";
import { FaqContent } from "../components/Faq";
import { PageHeader } from "../components/PageHeader";

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
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          accent="Najczęstsze"
          title="pytania"
          subtitle="Zebraliśmy najczęściej zadawane pytania, aby szybko rozwiać wątpliwości i pomóc Ci wybrać najlepszą wodę kokosową na co dzień."
        />
        <FaqContent />
      </div>
    </div>
  );
}
