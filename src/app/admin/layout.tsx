import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/orders">Orders</NavLink>
        <NavLink href="/admin/customers">Customers</NavLink>
      </Nav>
      <div className="container my-6 mx-auto max-w-screen-lg">{children}</div>
    </>
  );
}
