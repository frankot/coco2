import { Nav, NavLink } from "@/app/admin/NavAdmin";
import { LogOut } from "./_components/LogOut";
import Image from "next/image";
import { RefreshProvider } from "@/providers/RefreshProvider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Panel administracyjny",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    redirect("/auth/zaloguj?callbackUrl=/admin");
  }
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center -z-10 opacity-10 pointer-events-none">
        <Image src="/logo.png" alt="Logo" width={600} height={600} priority />
      </div>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/produkty">Produkty</NavLink>
        <NavLink href="/admin/zamowienia">Zamówienia</NavLink>
        <NavLink href="/admin/klienci">Klienci</NavLink>
        <NavLink href="/admin/rabaty">Rabaty</NavLink>
        <div className="absolute right-10">
          <LogOut />
        </div>
      </Nav>
      <div className="container my-6 mx-auto max-w-screen-lg">
        <RefreshProvider>{children}</RefreshProvider>
      </div>
    </>
  );
}
