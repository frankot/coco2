import { Nav, NavLink } from "./Nav";
import { BackgroundWrapper } from "./components/BackgroundWrapper";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundWrapper>
      <Nav>
        <NavLink href="/sklep">Sklep</NavLink>

        <NavLink href="/o-nas">O nas</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/nasza-historia">Nasza historia</NavLink>
        <NavLink href="/jakosc-smak">Jakość i smak</NavLink>
        <NavLink href="/kontakt">Kontakt</NavLink>
      </Nav>
      <div className="">{children}</div>
      <Footer />
      <CookieBanner />
    </BackgroundWrapper>
  );
}
