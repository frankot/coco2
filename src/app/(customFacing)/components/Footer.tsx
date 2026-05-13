"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "../data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-4 lg:mx-10 pt-8 lg:pt-16 pb-8">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="grid grid-cols-1 lg:flex lg:flex-row gap-6 lg:gap-16">
          {/* Column 1: Logo, About & Social Links */}
          <div className="flex-1 space-y-6">
            <Link href="/" className="block mb-4">
              <Image
                src="/logo.png"
                alt="Dr.Coco Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </Link>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold">{contactInfo.company.name}</p>
              <p>NIP: {contactInfo.company.nip}</p>
              <p>REGON: {contactInfo.company.regon}</p>
            </div>

            <div className="flex gap-4">
              <a
                href={contactInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
             
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex-1">
            <h3 className="text-lg text-primary font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0 mt-0.5" size={18} />
                <span className="text-gray-600">
                  {contactInfo.address.street}
                  <br />
                  {contactInfo.address.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex-1">
            <h3 className="text-lg text-primary font-semibold mb-4">Linki</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link href="/sklep" className="text-gray-600 hover:text-primary transition-colors">
                  Sklep
                </Link>
              </li>
              <li>
                <Link href="/nasza-historia" className="text-gray-600 hover:text-primary transition-colors">
                  Nasza historia
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div className="flex-1">
            <h3 className="text-lg text-primary font-semibold mb-4">Informacje prawne</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/regulamin" className="text-gray-600 hover:text-primary transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Polityka cookies
                </Link>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        {/* <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Dr.Coco. Wszystkie prawa zastrzeżone.
          </p>
        </div> */}
      </div>
    </footer>
  );
}

export default Footer;
