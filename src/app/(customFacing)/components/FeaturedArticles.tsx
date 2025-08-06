"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: 1,
    title: "Woda Kokosowa: Naturalny Izotonik",
    href: "#",
    description:
      "Odkryj, dlaczego woda kokosowa jest uznawana za najlepszy naturalny napój izotoniczny. Bogata w elektrolity i minerały, wspiera regenerację organizmu po intensywnym wysiłku.",
    imageUrl: "/about1.jpg",
  },
  {
    id: 2,
    title: "5 Powodów, dla Których Warto Pić Dr.Coco",
    href: "#",
    description:
      "Poznaj korzyści zdrowotne płynące z regularnego spożywania wody kokosowej Dr.Coco. Od wsparcia układu odpornościowego po poprawę trawienia i nawodnienie organizmu.",
    imageUrl: "/about2.jpg",
  },
  {
    id: 3,
    title: "Koktajle z Wodą Kokosową: Przepisy",
    href: "#",
    description:
      "Inspirujące przepisy na orzeźwiające i zdrowe koktajle z wykorzystaniem wody kokosowej Dr.Coco. Idealne na letnie dni, po treningu i na każdą okazję.",
    imageUrl: "/about3.jpg",
  },
  {
    id: 4,
    title: "Dr.Coco w Kuchni: Nowe Inspiracje",
    href: "#",
    description:
      "Odkryj kreatywne sposoby wykorzystania wody kokosowej Dr.Coco w kuchni. Od deserów po dania główne - woda kokosowa dodaje wyjątkowego smaku i wartości odżywczych.",
    imageUrl: "/about4.jpg",
  },
];

export function FeaturedArticles() {
  return (
    <section className="mt-16">
      <div className="container max-w-7xl mx-auto px-4 lg:px-6">
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="h-[450px]">
                {/* Image */}
                <div className="relative h-4/5 overflow-hidden rounded-lg mb-4">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                  <Link href={post.href} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                {/* Read More Button */}
                <div className="mt-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 h-auto font-medium group/btn"
                  >
                    <Link href={post.href} className="flex items-center gap-1 text-sm">
                      Czytaj więcej
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/10 px-8 py-3 rounded-xl text-lg font-semibold"
          >
            <Link href="/blog" className="flex items-center gap-2">
              Zobacz wszystkie artykuły
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
