import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Eye,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  CheckSquare,
  Layers,
  Download,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// View order details
export function ViewOrderDropdownItem({ id }: { id: string }) {
  return (
    <Link href={`/admin/zamowienia/${id}`}>
      <DropdownMenuItem className="cursor-pointer">
        <Eye className="mr-2 h-4 w-4" />
        <span>Szczegóły zamówienia</span>
      </DropdownMenuItem>
    </Link>
  );
}

// Order status update
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export function UpdateStatusDropdownItem({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: OrderStatus;
}) {
  const updateStatus = async (newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Status zamówienia został zmieniony na ${newStatus}`);
        // Refresh page to show updated status
        window.location.reload();
      } else {
        toast.error("Nie udało się zaktualizować statusu zamówienia");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji statusu");
      console.error(error);
    }
  };

  // Show different status update options based on current status
  switch (currentStatus) {
    case "PENDING":
      return (
        <>
          <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("PROCESSING")}>
            <Package className="mr-2 h-4 w-4" />
            <span>Rozpocznij realizację</span>
          </DropdownMenuItem>
          <ConfirmApaczkaDropdownItem id={id} />
        </>
      );

    case "PROCESSING":
      return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("SHIPPED")}>
          <Truck className="mr-2 h-4 w-4" />
          <span>Oznacz jako wysłane</span>
        </DropdownMenuItem>
      );

    case "SHIPPED":
      return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("DELIVERED")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Oznacz jako dostarczone</span>
        </DropdownMenuItem>
      );

    default:
      return null;
  }
}

// Cancel order
export function CancelOrderDropdownItem({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const confirmCancel = async () => {
    if (disabled) return;
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (response.ok) {
        toast.success("Zamówienie zostało anulowane");
        setOpen(false);
        // Refresh page to show updated status
        window.location.reload();
      } else {
        const text = await response.text();
        toast.error("Nie udało się anulować zamówienia");
        console.error("Cancel order failed", { id, status: response.status, body: text });
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas anulowania zamówienia");
      console.error("Cancel order error", { id, error });
    }
  };

  return (
    <>
      <DropdownMenuItem
        className={`${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer text-destructive"
        }`}
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
      >
        <XCircle className="mr-2 h-4 w-4" />
        <span>Anuluj zamówienie</span>
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anulować zamówienie?</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz anulować to zamówienie? Operacja spowoduje oznaczenie
              zamówienia jako anulowane i może powiadomić klienta (jeśli macie taką logikę).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Potwierdź anulowanie
            </Button>
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Confirm single order in Apaczka
export function ConfirmApaczkaDropdownItem({ id }: { id: string }) {
  const confirmOne = async () => {
    try {
      const res = await fetch(`/api/admin/shipping/apaczka/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || "Błąd API");
      toast.success("Zamówienie potwierdzone w Apaczka");
      window.location.reload();
    } catch (e: any) {
      toast.error(`Nie udało się potwierdzić: ${e?.message ?? "Błąd"}`);
    }
  };
  return (
    <DropdownMenuItem className="cursor-pointer" onClick={confirmOne}>
      <CheckSquare className="mr-2 h-4 w-4" />
      <span>Potwierdź w Apaczka</span>
    </DropdownMenuItem>
  );
}

// Download label if available
export function DownloadLabelDropdownItem({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) {
  const download = async () => {
    if (disabled) return;
    try {
      const res = await fetch(`/api/admin/shipping/apaczka/waybill/${id}`);
      if (!res.ok) throw new Error("Nie udało się pobrać etykiety");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Etykieta_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Błąd pobierania etykiety");
    }
  };
  return (
    <DropdownMenuItem
      className={`${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={download}
      disabled={disabled}
    >
      <Download className="mr-2 h-4 w-4" />
      <span>Pobierz etykietę</span>
    </DropdownMenuItem>
  );
}

// Bulk confirm helper button (to be used in page toolbar)
export async function confirmAllApaczka(generateTurnIn = true) {
  const res = await fetch(`/api/admin/shipping/apaczka/confirm-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ generateTurnIn }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || data.message || "Błąd API");
  return data as { created: any[]; failed: any[]; turnIn?: string };
}
