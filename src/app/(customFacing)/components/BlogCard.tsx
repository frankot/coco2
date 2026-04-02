import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  title: string;
  slug: string;
  imagePath?: string | null;
  createdAt: Date;
  content?: string;
};

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

export function BlogCard({ title, slug, imagePath, createdAt, content }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
            Brak obrazu
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-500 mb-2">{new Date(createdAt).toLocaleDateString()}</p>
        <h2 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        {content && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {stripHtml(content).slice(0, 160)}
            {stripHtml(content).length > 160 ? "..." : ""}
          </p>
        )}
        <Link href={`/blog/${slug}`} className="text-primary font-medium text-sm hover:underline">
          Czytaj dalej
        </Link>
      </div>
    </article>
  );
}
