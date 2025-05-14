import { Nav, NavLink } from "@/components/NavAdmin";
import { LogOut } from "./_components/LogOut";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Produkty</NavLink>
        <NavLink href="/admin/orders">Zamówienia</NavLink>
        <NavLink href="/admin/customers">Klienci</NavLink>
        <div className="absolute right-10">
          <LogOut />
        </div>
      </Nav>
      <div className="container my-6 mx-auto max-w-screen-lg">{children}</div>
    </>
  );
}
