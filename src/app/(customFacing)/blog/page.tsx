import Link from "next/link";
import Image from "next/image";
import prisma from "@/db";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60;

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="py-16 lg:mt-10">
        
      <div className="container max-w-7xl mx-auto px-4 lg:px-6">
                <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Wróć
          </Link>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Blog</h1>
  
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <article key={p.id} className="group bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-56">
                {p.imagePath ? (
                  <Image
                    src={p.imagePath}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    Brak obrazu
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  {stripHtml(p.content).slice(0, 160)}
                  {stripHtml(p.content).length > 160 ? "..." : ""}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Czytaj dalej →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
