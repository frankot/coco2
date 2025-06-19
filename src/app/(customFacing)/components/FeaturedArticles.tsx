"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "Woda Kokosowa: Naturalny Izotonik",
    href: "#",
    description:
      "Odkryj, dlaczego woda kokosowa jest uznawana za najlepszy naturalny napój izotoniczny. Bogata w elektrolity i minerały, wspiera regenerację organizmu.",
    imageUrl: "/about1.jpg",
    date: "15 Marca, 2024",
    datetime: "2024-03-15",
  },
  {
    id: 2,
    title: "5 Powodów, dla Których Warto Pić Dr.Coco",
    href: "#",
    description:
      "Poznaj korzyści zdrowotne płynące z regularnego spożywania wody kokosowej Dr.Coco. Od wsparcia układu odpornościowego po poprawę trawienia.",
    imageUrl: "/about2.jpg",
    date: "12 Marca, 2024",
    datetime: "2024-03-12",
  },
  {
    id: 3,
    title: "Koktajle z Wodą Kokosową: Przepisy",
    href: "#",
    description:
      "Inspirujące przepisy na orzeźwiające i zdrowe koktajle z wykorzystaniem wody kokosowej Dr.Coco. Idealne na letnie dni i po treningu.",
    imageUrl: "/about3.jpg",
    date: "10 Marca, 2024",
    datetime: "2024-03-10",
  },
];

export function FeaturedArticles() {
  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {posts.map((post, index) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={post.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-3xl bg-primary px-8 pb-8 pt-80 group"
            >
              <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                <Image
                  alt={post.title}
                  src={post.imageUrl}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-balck/20" />
              </div>

              <div className="absolute inset-0 -z-10 rounded-3xl ring-1 ring-inset ring-white/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm text-white/70">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
              </div>

              <div className="space-y-3">
                <h3 className="mt-3 text-xl font-galindo text-white group-hover:text-yellow-300 transition-colors">
                  <Link href={post.href}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-white/70 line-clamp-2">{post.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
