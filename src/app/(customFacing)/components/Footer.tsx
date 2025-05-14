"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants for staggered entrance
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="bg-background border-t-2 mx-10 border-primary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {/* Logo and About */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <Link href="/" className="block mb-4">
              <Image
                src="/logo.png"
                alt="Dr.Coco Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </Link>
            <p className="text-sm/relaxed text-gray-600 pr-4">
              Dr.Coco to naturalna woda kokosowa bez dodatku cukru i konserwantów. Nasze produkty są
              bogate w elektrolity i minerały, idealne dla osób prowadzących aktywny tryb życia.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h3 className="text-lg font-galindo text-primary font-semibold mb-4">Szybkie linki</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-primary transition-colors">
                  Sklep
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
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
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h3 className="text-lg font-galindo text-primary font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0 mt-0.5" size={18} />
                <span className="text-gray-600">
                  ul. Kokosowa 123
                  <br />
                  00-001 Warszawa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <a
                  href="tel:+48123456789"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  +48 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <a
                  href="mailto:kontakt@drcoco.pl"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  kontakt@drcoco.pl
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social Media and Newsletter */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h3 className="text-lg font-galindo text-primary font-semibold mb-4">Śledź nas</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/dr.coco"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" p-2 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" p-2 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" p-2 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom area with copyright and policy links */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Dr.Coco. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Polityka prywatności
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Warunki użytkowania
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Polityka cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
