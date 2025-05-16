import { Nav, NavLink } from "@/app/admin/NavAdmin";
import { LogOut } from "./_components/LogOut";
import Image from "next/image";
import { RefreshProvider } from "@/providers/RefreshProvider";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
