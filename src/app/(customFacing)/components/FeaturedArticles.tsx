import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/db";

export const revalidate = 300; // cache for 5 minutes

export default async function FeaturedArticles() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, imagePath: true, createdAt: true },
  });

  return (
    <section className="mt-16">
      <div className="container max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={post.id} className="group">
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
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
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
        </div>
      </div>
    </section>
  );
}

// Also provide a named export for compatibility with other imports
export { FeaturedArticles };
