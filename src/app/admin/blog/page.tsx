"use client";

import { Button } from "@/components/ui/button";
import PageHeader from "../_components/pageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "./_components/BlogActions";
import { useState, useEffect, useCallback } from "react";
import AdminLoading from "../loading";
import { useRouter } from "next/navigation";
import { useRefresh } from "@/providers/RefreshProvider";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
};

export default function AdminBlogPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Blog</PageHeader>
        <Button>
          <Link href="/admin/blog/new">Dodaj wpis</Link>
        </Button>
      </div>
      <BlogTable />
    </>
  );
}

function BlogTable() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { refreshCounter } = useRefresh();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog?timestamp=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshCounter]);

  if (loading) return <AdminLoading />;

  if (posts.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">Brak wpisów</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nagłówek</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="w-0">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.title}</TableCell>
            <TableCell>{p.slug}</TableCell>
            <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical className="size-4 cursor-pointer" />
                  <span className="sr-only">Otwórz menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/blog/${p.id}`}>Edytuj</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem id={p.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
