"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition, useCallback } from "react";
import { deleteBlogPost } from "../../_actions/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "@/providers/RefreshProvider";

export function DeleteDropdownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const res = await deleteBlogPost(id);
      router.refresh();
      triggerRefresh();
      if (res.success) toast.success(res.message || "Usunięto");
      else toast.error(res.message || "Błąd");
    });
  }, [id, router, triggerRefresh]);

  return (
    <DropdownMenuItem variant="destructive" disabled={isPending} onClick={handleDelete}>
      Usuń
    </DropdownMenuItem>
  );
}
