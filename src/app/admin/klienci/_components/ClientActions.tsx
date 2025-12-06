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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Zmień typ konta</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <ChangeTypeDialogContent id={id} currentType={currentType} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

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
        <DeleteDialogContent id={id} disabled={disabled} onClose={() => setIsOpen(false)} redirectAfterDelete />
      </DialogContent>
    </Dialog>
  );
}

export function ViewClientDetailsDropdownItem({ id }: { id: string }) {
  return (
    <DropdownMenuItem asChild>
      <Link href={`/admin/klienci/${id}`}>Szczegóły</Link>
    </DropdownMenuItem>
  );
}

// Shared dialog content components
function ChangeTypeDialogContent({
  id,
  currentType,
  onClose,
}: {
  id: string;
  currentType: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState(currentType);
  const { triggerRefresh } = useRefresh();

  const handleUpdateType = useCallback(() => {
    startTransition(async () => {
      const result = await updateClientType(id, selectedType as "ADMIN" | "DETAL" | "HURT");
      if (result.success) {
        toast.success(result.message);
        onClose();
        router.refresh();
        triggerRefresh();
      } else {
        toast.error(result.message);
      }
    });
  }, [id, selectedType, router, triggerRefresh, onClose]);

  return (
    <>
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
        <Button variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button onClick={handleUpdateType} disabled={isPending}>
          {isPending ? "Aktualizowanie..." : "Zapisz zmiany"}
        </Button>
      </DialogFooter>
    </>
  );
}

function DeleteDialogContent({
  id,
  disabled,
  onClose,
  redirectAfterDelete,
}: {
  id: string;
  disabled: boolean;
  onClose: () => void;
  redirectAfterDelete?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerRefresh } = useRefresh();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteClient(id);
      if (result.success) {
        toast.success(result.message);
        onClose();
        if (redirectAfterDelete) {
          router.push("/admin/klienci");
        }
        router.refresh();
        triggerRefresh();
      } else {
        toast.error(result.message);
      }
    });
  }, [id, router, triggerRefresh, onClose, redirectAfterDelete]);

  return (
    <>
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
        <Button variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isPending || disabled}>
          {isPending ? "Usuwanie..." : "Usuń klienta"}
        </Button>
      </DialogFooter>
    </>
  );
}

// Button versions for detail page
export function ChangeTypeButton({ id, currentType }: { id: string; currentType: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Zmień typ konta</Button>
      </DialogTrigger>
      <DialogContent>
        <ChangeTypeDialogContent id={id} currentType={currentType} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function DeleteButton({ id, disabled }: { id: string; disabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={disabled ? () => {} : setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={disabled}>
          Usuń klienta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DeleteDialogContent id={id} disabled={disabled} onClose={() => setIsOpen(false)} redirectAfterDelete />
      </DialogContent>
    </Dialog>
  );
}
