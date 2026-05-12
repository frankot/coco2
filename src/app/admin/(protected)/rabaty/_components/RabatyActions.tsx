"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition, useCallback } from "react";
import { toggleDiscountCode, deleteDiscountCode } from "../../../_actions/rabaty";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "@/providers/RefreshProvider";

export function ActiveToggleDropdownItem({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { triggerRefresh } = useRefresh();

  const handleToggle = useCallback(() => {
    startTransition(async () => {
      const result = await toggleDiscountCode(id, !isActive);
      router.refresh();
      triggerRefresh();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }, [id, isActive, router, triggerRefresh]);

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleToggle}>
      {isActive ? "Deaktywuj" : "Aktywuj"}
    </DropdownMenuItem>
  );
}

export function ActiveToggleButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { triggerRefresh } = useRefresh();

  const handleToggle = useCallback(() => {
    startTransition(async () => {
      const result = await toggleDiscountCode(id, !isActive);
      router.refresh();
      triggerRefresh();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }, [id, isActive, router, triggerRefresh]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={isPending}
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? "bg-primary" : "bg-input"}`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ${isActive ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
    if (disabled) {
      toast.error("Nie można usunąć — kod został użyty w zamówieniu i jest potrzebny jako referencja. Możesz go deaktywować.");
      return;
    }
    startTransition(async () => {
      const result = await deleteDiscountCode(id);
      router.refresh();
      triggerRefresh();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }, [id, disabled, router, triggerRefresh]);

  return (
    <DropdownMenuItem variant="destructive" disabled={isPending} onClick={handleDelete}>
      Usuń
    </DropdownMenuItem>
  );
}
