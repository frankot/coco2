import { Nav, NavLink } from "./Nav";
import { Footer } from "./components/Footer";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <Nav>
        <NavLink href="/sklep">Sklep</NavLink>
        <NavLink href="/kontakt">Kontakt</NavLink>
        <NavLink href="/o-nas">O nas</NavLink>
        <NavLink href="/blog">Blog</NavLink>
    
      </Nav>
      <div className="">{children}</div>
      <Footer />
    </div>
  );
}
