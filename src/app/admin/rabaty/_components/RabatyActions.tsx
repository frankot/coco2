"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition, useCallback } from "react";
import { toggleDiscountCode, deleteDiscountCode } from "../../_actions/rabaty";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "@/providers/RefreshProvider";

export function ActiveToggleDropdownItem({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
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

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
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
  }, [id, router, triggerRefresh]);

  return (
    <DropdownMenuItem variant="destructive" disabled={isPending || disabled} onClick={handleDelete}>
      Usuń
    </DropdownMenuItem>
  );
}
