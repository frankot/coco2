"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition, useCallback } from "react";
import { toggleProductAvailability, deleteProduct } from "../../../_actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "@/providers/RefreshProvider";
import { Trash2 } from "lucide-react";

export function ActiveToggleButton({ id, isAvailable }: { id: string; isAvailable: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { triggerRefresh } = useRefresh();

  const handleToggle = useCallback(() => {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailable);
      router.refresh();
      triggerRefresh();
      toast.success(`Produkt został ${!isAvailable ? "aktywowany" : "deaktywowany"}`);
    });
  }, [id, isAvailable, router, triggerRefresh]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isAvailable}
      disabled={isPending}
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${isAvailable ? "bg-primary" : "bg-input"}`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ${isAvailable ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
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

export function DeleteButton({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteProduct(id);
      router.refresh();
      triggerRefresh();
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/produkty");
      } else {
        toast.error(result.message);
      }
    });
  }, [id, router, triggerRefresh]);

  return (
    <button
      type="button"
      disabled={isPending || disabled}
      onClick={handleDelete}
      className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 className="size-4" />
      Usuń produkt
    </button>
  );
}
