import { Nav, NavLink, NavDropdown } from "../(customFacing)/Nav";
import { BackgroundWrapper } from "../(customFacing)/components/BackgroundWrapper";
import { Footer } from "../(customFacing)/components/Footer";
import { CookieBanner } from "../(customFacing)/components/CookieBanner";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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
      {children}
      <Footer />
      <CookieBanner />
    </BackgroundWrapper>
  );
}
