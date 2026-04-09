import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { BlogCard } from "./BlogCard";

export const revalidate = 300; // cache for 5 minutes

export default async function FeaturedArticles() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, imagePath: true, createdAt: true, content: true },
  });

  return (
    <section className="my-16">
      <div className="container max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              imagePath={post.imagePath}
              content={post.content}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className=" text-primary shadow-none border-none hover:text-primary/80 px-8 py-3 rounded-xl text-lg font-semibold"
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
