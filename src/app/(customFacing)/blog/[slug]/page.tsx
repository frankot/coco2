import Image from "next/image";
import prisma from "@/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params; // await params per Next.js dynamic route guidance
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post)
    return <div className="py-16 container mx-auto px-6 max-w-3xl">Wpis nie znaleziony</div>;

  return (
    <section className="py-16 lg:mt-10">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Wróć
          </Link>
          <p className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text Column */}
          <div className="space-y-8 order-2 lg:order-1">
            <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          {/* Image Column (Sticky) */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            {post.imagePath ? (
              <div className="relative w-full h-[560px] rounded-lg overflow-hidden shadow-lg">
                <Image src={post.imagePath} alt={post.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-[400px] bg-muted rounded-lg" />
            )}
          </div>
        </div>
        
      </div>
    </section>
  );
}
