import { Nav, NavLink, NavDropdown } from "./Nav";
import { BackgroundWrapper } from "./components/BackgroundWrapper";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundWrapper>
      <Nav
        navItems={[
          { type: "link", href: "/sklep", label: "Sklep" },
          {
            type: "dropdown",
            label: "O nas",
            items: [
              { href: "/nasza-historia", label: "Nasza historia" },
              { href: "/jakosc-smak", label: "Jakość i smak" },
            ],
          },
          { type: "link", href: "/blog", label: "Blog" },
          { type: "link", href: "/kontakt", label: "Kontakt" },
        ]}
      >
        <NavLink href="/sklep">Sklep</NavLink>

        <NavDropdown
          label="O nas"
          items={[
            { href: "/nasza-historia", label: "Nasza historia" },
            { href: "/jakosc-smak", label: "Jakość i smak" },
          ]}
        />
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/kontakt">Kontakt</NavLink>
      </Nav>
      <div className="">{children}</div>
      <Footer />
      <CookieBanner />
    </BackgroundWrapper>
  );
}
