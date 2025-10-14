"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Post = {
  id: string;
  title: string;
  slug: string;
  imagePath: string | null;
  createdAt: string | Date;
};

export default function LatestArticlesClient({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return <div className="text-sm text-muted-foreground">Brak artykułów</div>;
  }

  return (
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
          <div className="h-[450px]">
            <div className="relative h-4/5 overflow-hidden rounded-lg mb-4">
              {post.imagePath ? (
                <Image
                  src={post.imagePath}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
                  Brak obrazu
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            <div className="mt-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 h-auto font-medium group/btn"
              >
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-sm">
                  Czytaj więcej
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
