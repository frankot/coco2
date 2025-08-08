"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition, useState, useCallback } from "react";
import { updateClientType, deleteClient } from "../../_actions/clients";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRefresh } from "@/providers/RefreshProvider";

export function ChangeTypeDropdownItem({ id, currentType }: { id: string; currentType: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(currentType);
  const { triggerRefresh } = useRefresh();

  const handleUpdateType = useCallback(() => {
    startTransition(async () => {
      const result = await updateClientType(id, selectedType as "ADMIN" | "DETAL" | "HURT");
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        // Force refresh data
        router.refresh();
        triggerRefresh(); // Trigger client-side refetch
      } else {
        toast.error(result.message);
      }
    });
  }, [id, selectedType, router, triggerRefresh]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Zmień typ konta</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmień typ konta</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DETAL" id="detal" />
              <Label htmlFor="detal">Detal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="HURT" id="hurt" />
              <Label htmlFor="hurt">Hurt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ADMIN" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={handleUpdateType} disabled={isPending}>
            {isPending ? "Aktualizowanie..." : "Zapisz zmiany"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteClient(id);
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        // Force refresh data
        router.refresh();
        triggerRefresh(); // Trigger client-side refetch
      } else {
        toast.error(result.message);
      }
    });
  }, [id, router, triggerRefresh]);

  return (
    <Dialog open={isOpen} onOpenChange={disabled ? () => {} : setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled}
          onSelect={(e) => e.preventDefault()}
        >
          Usuń
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Czy na pewno chcesz usunąć tego klienta?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Ta operacja jest nieodwracalna i spowoduje usunięcie wszystkich danych klienta.</p>
          {disabled && (
            <p className="text-destructive mt-2">
              Nie można usunąć klienta, który posiada zamówienia.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending || disabled}>
            {isPending ? "Usuwanie..." : "Usuń klienta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditClientDropdownItem({ id }: { id: string }) {
  return (
    <DropdownMenuItem asChild>
      <Link href={`/admin/klienci/${id}`}>Edytuj</Link>
    </DropdownMenuItem>
  );
}
