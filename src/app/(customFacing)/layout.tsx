import { Nav, NavLink } from "./Nav";
import { Footer } from "./components/Footer";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 -z-10 opacity-20">
        <Image
          src="/palmy-prawa.png"
          alt="Palm decoration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
      
      <div className="absolute top-0 right-0 -z-10 opacity-50 rotate-180">
        <Image
          src="/palmy-prawa.png" 
          alt="Palm decoration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-0 left-0 -z-10 opacity-50 -rotate-90">
        <Image
          src="/palmy-prawa.png"
          alt="Palm decoration" 
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

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
