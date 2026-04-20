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

export function getOverrideCopy(
  target: "PAID" | "PROCESSING" | "SHIPPED" | null,
  isB2BManual = false
) {
  if (isB2BManual) {
    switch (target) {
      case "PAID":
        return "Zamówienie B2B (obsługa ręczna). Zostanie oznaczone jako opłacone, data płatności zostanie ustawiona na teraz. Apaczka i wFirma pozostają bez zmian — obsługa ręczna.";
      case "PROCESSING":
        return "Zamówienie B2B (obsługa ręczna). Zostanie oznaczone jako opłacone i rozpoczniemy realizację. NIE zostanie utworzone zlecenie w Apaczce ani faktura wFirma — dostawa i faktura obsługiwane ręcznie. Data płatności zostanie ustawiona na teraz.";
      case "SHIPPED":
        return "Zamówienie B2B (obsługa ręczna). Zostanie oznaczone jako opłacone i wysłane. Brak integracji z Apaczką i wFirmą. Data płatności zostanie ustawiona na teraz.";
      default:
        return "";
    }
  }
  switch (target) {
    case "PAID":
      return "Nie otrzymaliśmy płatności za to zamówienie. Zostanie oznaczone jako opłacone, a data płatności zostanie ustawiona na teraz.";
    case "PROCESSING":
      return "Nie otrzymaliśmy płatności za to zamówienie. Zostanie oznaczone jako opłacone i rozpoczniemy realizację. Zamówienie zostanie automatycznie potwierdzone w Apaczce (utworzona etykieta nadawcza). Data płatności zostanie ustawiona na teraz.";
    case "SHIPPED":
      return "Nie otrzymaliśmy płatności za to zamówienie. Zostanie oznaczone jako opłacone i wysłane. NIE zostanie utworzone zlecenie w Apaczce (pomijamy etap realizacji) — jeśli potrzebujesz etykiety nadawczej, musisz utworzyć ją ręcznie. E-mail o wysyłce zostanie wysłany do klienta. Data płatności zostanie ustawiona na teraz.";
    default:
      return "";
  }
}

// Combined component that owns both the dropdown and dialog states
export function OrderActionsMenu({
  id,
  currentStatus,
  hasApaczkaOrderId,
  wfirmaInvoiceId,
  isB2BManual = false,
}: {
  id: string;
  currentStatus: OrderStatus;
  hasApaczkaOrderId: boolean;
  wfirmaInvoiceId: string | null;
  isB2BManual?: boolean;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState<
    "PAID" | "PROCESSING" | "SHIPPED" | null
  >(null);
  const [labelDownloading, setLabelDownloading] = useState(false);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);
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

  const downloadLabel = async () => {
    setLabelDownloading(true);
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
    } finally {
      setTimeout(() => setLabelDownloading(false), 5000);
    }
  };

  const downloadInvoice = async () => {
    setInvoiceDownloading(true);
    try {
      const res = await fetch(`/api/admin/invoices/${id}/download`);
      if (!res.ok) throw new Error("Nie udało się pobrać faktury");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Faktura_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Błąd pobierania faktury");
    } finally {
      setTimeout(() => setInvoiceDownloading(false), 5000);
    }
  };

  const confirmOverride = async () => {
    if (!overrideTarget) return;
    const target = overrideTarget;
    setOverrideTarget(null);
    await updateStatus(target);
  };

  const renderStatusItems = () => {
    switch (currentStatus) {
      case "PENDING":
        return (
          <>
            <DropdownMenuItem className="cursor-pointer" onSelect={() => setOverrideTarget("PAID")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Oznacz jako opłacone</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setOverrideTarget("PROCESSING")}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Rozpocznij realizację</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setOverrideTarget("SHIPPED")}
            >
              <Truck className="mr-2 h-4 w-4" />
              <span>Oznacz jako wysłane</span>
            </DropdownMenuItem>
          </>
        );
      case "PAID":
        return (
          <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("PROCESSING")}>
            <Package className="mr-2 h-4 w-4" />
            <span>Rozpocznij realizację</span>
          </DropdownMenuItem>
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
          {!isB2BManual && hasApaczkaOrderId && (
            <DropdownMenuItem className="cursor-pointer" onClick={downloadLabel} disabled={labelDownloading}>
              <Download className="mr-2 h-4 w-4" />
              <span>{labelDownloading ? "Pobieranie..." : "Pobierz etykietę"}</span>
            </DropdownMenuItem>
          )}
          {!isB2BManual && wfirmaInvoiceId && (
            <DropdownMenuItem className="cursor-pointer" onClick={downloadInvoice} disabled={invoiceDownloading}>
              <Download className="mr-2 h-4 w-4" />
              <span>{invoiceDownloading ? "Pobieranie..." : "Pobierz fakturę"}</span>
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

      <Dialog
        open={overrideTarget !== null}
        onOpenChange={(o) => !o && setOverrideTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź zmianę statusu bez płatności</DialogTitle>
            <DialogDescription>{getOverrideCopy(overrideTarget, isB2BManual)}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOverrideTarget(null)}>
              Anuluj
            </Button>
            <Button onClick={confirmOverride}>Potwierdź</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
