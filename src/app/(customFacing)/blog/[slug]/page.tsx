import Image from "next/image";
import prisma from "@/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

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

  // Convert content to a plain text summary (handles HTML or Markdown)
  const plainText = post.content
    .replace(/<[^>]*>?/gm, "") // remove HTML tags
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // markdown links [text](url)
    .replace(/[`*_~>#-]/g, "") // common markdown punctuation
    .replace(/\n+/g, " "); // collapse newlines
  const description = plainText.slice(0, 160) + (plainText.length > 160 ? "..." : "");

  return {
    title: `Dr.Coco | ${post.title}`,
    description,
  };
}

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
            <div className="prose prose-lg max-w-none text-gray-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold leading-tight mt-6 mb-3">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-semibold mt-5 mb-2">{children}</h3>
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
