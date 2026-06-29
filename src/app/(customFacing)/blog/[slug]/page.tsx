import Image from "next/image";
import prisma from "@/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) {
    return {
      title: "Dr.Coco | Blog",
      description: "Artykuł nie został znaleziony.",
    };
  }

  const plainText = post.content
    .replace(/<[^>]*>?/gm, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[`*_~>#-]/g, "")
    .replace(/\n+/g, " ");
  const description = plainText.slice(0, 160) + (plainText.length > 160 ? "..." : "");

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `https://drcoco.pl/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Dr.Coco Blog`,
      description,
      url: `https://drcoco.pl/blog/${slug}`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Dr.Coco"],
      ...(post.imagePath
        ? {
            images: [
              {
                url: post.imagePath,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Dr.Coco Blog`,
      description,
      ...(post.imagePath ? { images: [post.imagePath] } : {}),
    },
  };
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post)
    return (
      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">Wpis nie znaleziony</div>
      </div>
    );

  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do bloga
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text Column */}
          <div className="space-y-6 order-2 lg:order-1">
            <div>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
                {post.title}
              </h1>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, defaultSchema]]}
                components={{
                  h1: ({ children }) => (
                    <h2 className="text-4xl font-bold leading-tight mt-6 mb-3">{children}</h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-3xl font-semibold mt-6 mb-3">{children}</h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-2xl font-semibold mt-5 mb-2">{children}</h4>
                  ),
                  p: ({ children }) => <p className="my-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-primary underline">
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 pl-4 italic my-4">{children}</blockquote>
                  ),
                  hr: () => <hr className="my-6" />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            {post.imagePath ? (
              <div className="relative w-full h-[560px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={post.imagePath}
                  alt={post.title}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[400px] bg-gray-50 rounded-2xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
