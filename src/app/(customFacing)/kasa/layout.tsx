import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasa - Checkout",
  description: "Dokończ zamówienie",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex justify-center w-full lg:mt-20">{children}</div>;
}
