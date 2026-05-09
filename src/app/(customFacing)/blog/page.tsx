import Link from "next/link";
import prisma from "@/db";
import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";
import { BlogCard } from "../components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Czytaj najnowsze artykuły o zdrowym życiu, wodzie kokosowej i produktach Dr.Coco®. Porady zdrowotne, przepisy i inspiracje.",
  alternates: {
    canonical: "https://drcoco.pl/blog",
  },
  openGraph: {
    title: "Blog | Dr.Coco",
    description: "Artykuły o zdrowym życiu, wodzie kokosowej i naturalnych produktach Dr.Coco®.",
    url: "https://drcoco.pl/blog",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Dr.Coco",
    description: "Artykuły o zdrowym życiu, wodzie kokosowej i naturalnych produktach Dr.Coco®.",
  },
};

export const revalidate = 60;

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          accent="Blog"
          subtitle="Artykuły o zdrowym życiu, wodzie kokosowej i naturalnych produktach Dr.Coco"
        />

        <div className="mb-6">
          <p className="text-gray-600">Znaleziono {posts.length} artykułów</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <BlogCard
              key={p.id}
              title={p.title}
              slug={p.slug}
              imagePath={p.imagePath}
              createdAt={p.createdAt}
              content={p.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
