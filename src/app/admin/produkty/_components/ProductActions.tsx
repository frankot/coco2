"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition, useCallback } from "react";
import { toggleProductAvailability, deleteProduct } from "../../_actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "@/providers/RefreshProvider";

export function ActiveToggleDropdownItem({
  id,
  isAvailable,
}: {
  id: string;
  isAvailable: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { triggerRefresh } = useRefresh();

  const handleToggle = useCallback(() => {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailable);
      // Force a refetch of data
      router.refresh();
      triggerRefresh(); // Trigger client-side refetch
      // Add toast for feedback
      toast.success(`Produkt został ${!isAvailable ? "aktywowany" : "deaktywowany"}`);
    });
  }, [id, isAvailable, router, triggerRefresh]);

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleToggle}>
      {isAvailable ? "Deaktywuj" : "Aktywuj"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteProduct(id);
      // Force a refetch of data
      router.refresh();
      triggerRefresh(); // Trigger client-side refetch
      // Add feedback toast
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }, [id, router, triggerRefresh]);

  return (
    <DropdownMenuItem variant="destructive" disabled={isPending || disabled} onClick={handleDelete}>
      Usuń
    </DropdownMenuItem>
  );
}
