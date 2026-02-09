import { readFileSync } from "fs";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReadmePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const filePath = join(process.cwd(), "ADMIN_PANEL.md");
  let content = readFileSync(filePath, "utf-8");

  // Replace backtick-wrapped URLs with markdown links
  content = content.replace(/`(\/admin\/[^`]+)`/g, (match, url) => {
    return `[${url}](${appUrl}${url})`;
  });

  content = content.replace(/`(\/readme)`/g, (match, url) => {
    return `[${url}](${appUrl}${url})`;
  });

  // Remove backticks from UI elements that shouldn't look like code
  // Remove from menu icon (three dots)
  content = content.replace(/`⋮`/g, "⋮");

  // Remove from button/menu item references (but keep the text intact)
  content = content.replace(/`„([^"]+)"`/g, '„$1"');
  content = content.replace(/`"([^"]+)"`/g, '"$1"');

  // Remove from common UI references like "DETAL", "HURT", "ADMIN" when in backticks
  content = content.replace(/`(DETAL|HURT|ADMIN)`/g, "$1");

  // Remove from status names when in backticks
  content = content.replace(/`(PENDING|PAID|PROCESSING|SHIPPED|DELIVERED|CANCELLED)`/g, "$1");

  // Remove from simple field/column names that aren't paths
  content = content.replace(
    /`(Dostępność|Nazwa|Cena|Zamówienia|Akcje|Email|Status|Data|Klient|Produkty|Kwota|Obraz|Treść|Tytuł|Slug|Nagłówek)`/g,
    "$1"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">MANUAL</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Wróć
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <article className="prose prose-sm sm:prose lg:prose-lg prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-3xl font-bold text-slate-900 mt-8 mb-4 first:mt-0" />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  {...props}
                  className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-slate-200 pb-2"
                />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-xl font-semibold text-slate-700 mt-6 mb-3" />
              ),
              h4: ({ node, ...props }) => (
                <h4 {...props} className="text-lg font-semibold text-slate-700 mt-4 mb-2" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="text-slate-600 leading-relaxed my-4" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc list-inside space-y-2 my-4 text-slate-600" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal list-inside space-y-2 my-4 text-slate-600" />
              ),
              li: ({ node, ...props }) => <li {...props} className="ml-2" />,
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4 rounded-lg border border-slate-200">
                  <table {...props} className="w-full text-sm border-collapse" />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead {...props} className="bg-slate-100 border-b border-slate-200" />
              ),
              th: ({ node, ...props }) => (
                <th
                  {...props}
                  className="px-4 py-2 text-left font-semibold text-slate-700 border-r border-slate-200 last:border-r-0"
                />
              ),
              tr: ({ node, ...props }) => (
                <tr
                  {...props}
                  className="border-b border-slate-200 hover:bg-slate-50 last:border-b-0"
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  {...props}
                  className="px-4 py-2 text-slate-600 border-r border-slate-200 last:border-r-0"
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  {...props}
                  className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 rounded-r text-blue-900 italic"
                />
              ),
              code: ({ node, className, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code
                    {...props}
                    className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200"
                  />
                ) : (
                  <code
                    {...props}
                    className={`block bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono border border-slate-700 ${
                      className ?? ""
                    }`}
                  />
                );
              },
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                />
              ),
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="max-w-full h-auto rounded-lg border border-slate-200 my-4"
                />
              ),
              hr: ({ node, ...props }) => <hr {...props} className="my-8 border-slate-200" />,
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-bold text-slate-800" />
              ),
              em: ({ node, ...props }) => <em {...props} className="italic text-slate-700" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600 text-center">
            © {new Date().getFullYear()} Panel Administracyjny. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}
