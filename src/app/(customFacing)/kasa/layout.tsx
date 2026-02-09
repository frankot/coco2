import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasa",
  description:
    "Dokończ zamówienie w sklepie Dr.Coco®. Bezpieczne płatności online, szybka dostawa w całej Polsce.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex justify-center w-full lg:mt-16">{children}</div>;
}
