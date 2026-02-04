"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addBlogPost, updateBlogPost } from "../../_actions/blog";
import type { BlogPost } from "@/app/generated/prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function BlogForm({ post }: { post?: BlogPost | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [keepImage, setKeepImage] = useState(true);
  const router = useRouter();

  const initialState = { error: {}, success: false } as any;
  const [isPending, startTransition] = useTransition();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setKeepImage(false);
      e.target.value = ""; // allow re-selecting same file
    }
  };

  const removeSelected = () => setSelectedFile(null);

  const customFormAction = (formData: FormData) => {
    formData.set("title", title);
    formData.set("content", content);
    formData.set("keepImage", String(keepImage));
    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    startTransition(async () => {
      const result = post
        ? await updateBlogPost(post.id, initialState, formData as any)
        : await addBlogPost(initialState, formData as any);
      if (result?.error?._form) {
        toast.error(result.error._form[0] || "Błąd");
        return;
      }
      if (result?.success) {
        toast.success(post ? "Wpis zaktualizowany" : "Wpis dodany");
        router.push("/admin/blog");
        router.refresh();
      }
    });
  };

  return (
    <form ref={formRef} action={customFormAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Tytuł</Label>
        <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2" suppressHydrationWarning>
        <Label htmlFor="content">Treść (Markdown)</Label>
        <div data-color-mode="light">
          {/* Hidden input to ensure content is posted with formData */}
          <input type="hidden" id="content" name="content" value={content} />
          <MDEditor value={content} onChange={(val) => setContent(val || "")} />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Obraz wpisu</Label>
        {/* Existing image */}
        {post?.imagePath && keepImage && !selectedFile && (
          <div className="relative inline-block group">
            <Image
              src={post.imagePath}
              alt="post image"
              width={240}
              height={160}
              className="rounded object-cover w-60 h-40"
            />
            <button
              type="button"
              onClick={() => setKeepImage(false)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Usuń
            </button>
          </div>
        )}
        {/* Selected new image preview */}
        {selectedFile && (
          <div className="relative inline-block group">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              width={240}
              height={160}
              className="rounded object-cover w-60 h-40"
            />
            <button
              type="button"
              onClick={removeSelected}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Usuń
            </button>
          </div>
        )}
        {/* Upload tile */}
        {(!keepImage || !post?.imagePath) && !selectedFile && (
          <label className="cursor-pointer inline-block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors w-60">
              <span className="text-sm text-gray-600">Dodaj obraz</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </label>
        )}
        {/* Helper text */}
        {!post?.imagePath && !selectedFile && (
          <p className="text-sm text-muted-foreground">
            Opcjonalny. Użyj atrakcyjnego obrazu dla wpisu.
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? post
              ? "Aktualizuję..."
              : "Dodaję..."
            : post
              ? "Aktualizuj wpis"
              : "Dodaj wpis"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Wróć
        </Button>
      </div>
    </form>
  );
}
