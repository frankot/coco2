"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: 1,
    title: "Woda Kokosowa: Naturalny Izotonik",
    href: "#",
    description:
      "Odkryj, dlaczego woda kokosowa jest uznawana za najlepszy naturalny napój izotoniczny. Bogata w elektrolity i minerały, wspiera regenerację organizmu po intensywnym wysiłku.",
    imageUrl: "/about1.jpg",
    date: "15 Marca, 2024",
    datetime: "2024-03-15",
    readTime: "5 min",
    category: "Zdrowie",
  },
  {
    id: 2,
    title: "5 Powodów, dla Których Warto Pić Dr.Coco",
    href: "#",
    description:
      "Poznaj korzyści zdrowotne płynące z regularnego spożywania wody kokosowej Dr.Coco. Od wsparcia układu odpornościowego po poprawę trawienia i nawodnienie organizmu.",
    imageUrl: "/about2.jpg",
    date: "12 Marca, 2024",
    datetime: "2024-03-12",
    readTime: "7 min",
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "Koktajle z Wodą Kokosową: Przepisy",
    href: "#",
    description:
      "Inspirujące przepisy na orzeźwiające i zdrowe koktajle z wykorzystaniem wody kokosowej Dr.Coco. Idealne na letnie dni, po treningu i na każdą okazję.",
    imageUrl: "/about3.jpg",
    date: "10 Marca, 2024",
    datetime: "2024-03-10",
    readTime: "3 min",
    category: "Przepisy",
  },
];

export function FeaturedArticles() {
  return (
    <section className=" mt-16 ">
      <div className="container mx-auto px-4">
        {/* Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            NAJNOWSZE ARTYKUŁY
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Odkryj Świat
            <span className="text-primary block">Kokosów</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Przeczytaj nasze artykuły o korzyściach zdrowotnych kokosów i poznaj inspirujące
            przepisy
          </p>
        </motion.div> */}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-al h-[450px] duration-300 hover:transform hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.datetime}>{post.date}</time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                    <Link href={post.href} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Read More Button */}
                  <Button
                    asChild
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 h-auto font-medium group/btn"
                  >
                    <Link href={post.href} className="flex items-center gap-2">
                      Czytaj więcej
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
