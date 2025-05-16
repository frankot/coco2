import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasa - Checkout",
  description: "Dokończ zamówienie",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <div className="mi-screen bg-background">{children}</div>;
}
