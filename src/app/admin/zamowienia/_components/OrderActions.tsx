import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  CheckSquare,
  Download,
  MoreVertical,
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// Combined component that owns both the dropdown and dialog states
export function OrderActionsMenu({
  id,
  currentStatus,
  hasApaczkaOrderId,
}: {
  id: string;
  currentStatus: OrderStatus;
  hasApaczkaOrderId: boolean;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const isCancelDisabled = currentStatus === "DELIVERED" || currentStatus === "CANCELLED";

  const updateStatus = async (newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success(`Status zamówienia został zmieniony na ${newStatus}`);
        window.location.reload();
      } else {
        toast.error("Nie udało się zaktualizować statusu zamówienia");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji statusu");
      console.error(error);
    }
  };

  const confirmCancel = async () => {
    if (isCancelDisabled) return;
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (response.ok) {
        toast.success("Zamówienie zostało anulowane");
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

  const confirmApaczka = async () => {
    try {
      const res = await fetch(`/api/admin/shipping/apaczka/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMsg = data.error || data.message || "Błąd API";
        toast.error(`Apaczka: ${errorMsg}`, { duration: 8000 });
        return;
      }
      toast.success("Zamówienie potwierdzone w Apaczka");
      window.location.reload();
    } catch (e: any) {
      toast.error(`Błąd połączenia: ${e?.message ?? "Nieznany błąd"}`, { duration: 6000 });
    }
  };

  const downloadLabel = async () => {
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

  // Render status-specific items
  const renderStatusItems = () => {
    switch (currentStatus) {
      case "PENDING":
      case "PAID":
        return (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("PROCESSING")}>
              <Package className="mr-2 h-4 w-4" />
              <span>Rozpocznij realizację</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={confirmApaczka}>
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>Potwierdź w Apaczka</span>
            </DropdownMenuItem>
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
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <MoreVertical className="size-4 cursor-pointer" />
          <span className="sr-only">Otwórz menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={`/admin/zamowienia/${id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              <span>Szczegóły zamówienia</span>
            </DropdownMenuItem>
          </Link>
          {renderStatusItems()}
          {hasApaczkaOrderId && (
            <DropdownMenuItem className="cursor-pointer" onClick={downloadLabel}>
              <Download className="mr-2 h-4 w-4" />
              <span>Pobierz etykietę</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`${
              isCancelDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer text-destructive"
            }`}
            onSelect={() => !isCancelDisabled && setCancelOpen(true)}
            disabled={isCancelDisabled}
          >
            <XCircle className="mr-2 h-4 w-4" />
            <span>Anuluj zamówienie</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anulować zamówienie?</DialogTitle>
            <DialogDescription>Czy na pewno chcesz anulować to zamówienie?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Potwierdź anulowanie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
