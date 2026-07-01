"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageHeader from "../../_components/pageHeader";
import Link from "next/link";
import { deleteAllOrders } from "../../_actions/clean-db";
import {
  Table,
  TableBody,
  TableCell,
  TableCellLink,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import AdminLoading from "../loading";
import { OrderActionsMenu, confirmAllApaczka } from "./_components/OrderActions";
import Pagination from "../../_components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Type definitions
type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderItem = {
  quantity: number;
  pricePerItemInCents: number;
  product: {
    name: string;
  };
};

type Order = {
  id: string;
  pricePaidInCents: number;
  createdAt: string;
  paidAt: string | null;
  status: OrderStatus;
  paymentMethod: string | null;
  apaczkaOrderId?: string | null;
  apaczkaWaybillNumber?: string | null;
  wfirmaInvoiceId?: string | null;
  wfirmaInvoiceNumber?: string | null;
  isB2BManual?: boolean;
  user: {
    id: string;
    email: string;
    accountType: string;
  };
  orderItems: OrderItem[];
  _count: {
    orderItems: number;
  };
};

// Sorting type
type SortField = "createdAt" | "paidAt" | "status" | "totalItems" | "totalAmount";
type SortDirection = "asc" | "desc";

export default function AdminOrdersPage() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [downloadTurnIn, setDownloadTurnIn] = useState(true);
  const [showB2B, setShowB2B] = useState(true);
  const [showRegular, setShowRegular] = useState(true);

  const downloadWaybillsZip = async (orders: { id: string }[]) => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    let downloaded = 0;

    for (const item of orders) {
      try {
        const res = await fetch(`/api/admin/shipping/apaczka/waybill/${item.id}`);
        if (!res.ok) {
          toast.error(`Nie udało się pobrać etykiety dla zamówienia ${item.id}`);
          continue;
        }
        const disposition = res.headers.get("Content-Disposition");
        const filename =
          disposition?.match(/filename="(.+)"/)?.[1] || `Etykieta_${item.id}.pdf`;
        const buf = await res.arrayBuffer();
        zip.file(filename, buf, { binary: true });
        downloaded++;
      } catch (e) {
        toast.error(`Błąd pobierania etykiety dla zamówienia ${item.id}`);
      }
    }

    if (downloaded === 0) return;

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Etykiety_Apaczka_${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Pobrano ${downloaded} etykiet`);
  };

  const handleConfirmAll = async () => {
    setIsConfirming(true);
    const shouldDownloadWaybills = downloadTurnIn;
    try {
      const res = await confirmAllApaczka();
      const created = res.created?.length || 0;
      const failed = res.failed?.length || 0;

      if (created > 0 && failed === 0) {
        toast.success(`Utworzono ${created} przesyłek w Apaczka`);
      } else if (created > 0 && failed > 0) {
        toast.warning(`Utworzono: ${created}, błędy: ${failed}`, { duration: 6000 });
        res.failed.forEach((f: any) => {
          toast.error(`Zamówienie ${f.id}: ${f.error}`, { duration: 10000 });
        });
      } else if (failed > 0) {
        toast.error(`Wszystkie przesyłki zakończyły się błędem (${failed})`, { duration: 6000 });
        res.failed.forEach((f: any) => {
          toast.error(`Zamówienie ${f.id}: ${f.error}`, { duration: 10000 });
        });
      } else {
        toast.info("Brak zamówień do potwierdzenia");
      }

      if (shouldDownloadWaybills && res.created?.length) {
        await downloadWaybillsZip(res.created);
      }

      if (created > 0) {
        window.location.reload();
      }
    } catch (e: any) {
      toast.error(`Błąd potwierdzania Apaczka: ${e?.message ?? e}`, { duration: 6000 });
      console.error("confirmAllApaczka error:", e);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      {/* Confirmation modal */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź wysyłkę do Apaczka</DialogTitle>
            <DialogDescription>
              Wszystkie opłacone zamówienia zostaną wysłane do Apaczka, a ich status zmieni się na „W realizacji”.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={downloadTurnIn}
                onChange={(e) => setDownloadTurnIn(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              Pobierz zbiorowy list przewozowy
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleConfirmAll}>
              Wyślij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <PageHeader>Zamówienia</PageHeader>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showB2B}
                onChange={(e) => setShowB2B(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              B2B
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showRegular}
                onChange={(e) => setShowRegular(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              Regularne
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            disabled={isConfirming}
            title="Potwierdzi wszystkie opłacone zamówienia — wyśle do Apaczki i zmieni status na W realizacji."
            onClick={() => setConfirmDialogOpen(true)}
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConfirming ? "Potwierdzanie..." : "Apaczka - wyślij opłacone"}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const resp = await fetch(`/api/admin/shipping/apaczka/sync-all`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({}),
                });
                const data = await resp.json();
                console.info("sync-all response:", data);
                if (!resp.ok || !data.success) {
                  toast.error(`Błąd synchronizacji: ${data.message || "Błąd API"}`);
                  console.error("sync-all failed response:", data);
                  return;
                }
                const updated = data.results?.filter((r: any) => r.ok).length ?? 0;
                const failed = data.results?.filter((r: any) => !r.ok).length ?? 0;
                toast.success(`Zsynchronizowano: ${updated}, błędy: ${failed}`);
                // print detailed errors for failed items
                if (data.results && Array.isArray(data.results)) {
                  const failures = data.results.filter((r: any) => !r.ok);
                  if (failures.length) console.error("sync-all failures:", failures);
                }
                window.location.reload();
              } catch (e: any) {
                toast.error(`Błąd synchronizacji: ${e?.message ?? e}`);
                console.error("sync-all error:", e);
              }
            }}
          >
            Synchronizuj statusy Apaczka
          </Button>
        </div>
      </div>
      <OrdersTable showB2B={showB2B} showRegular={showRegular} />
    </>
  );
}

function OrdersTable({ showB2B, showRegular }: { showB2B: boolean; showRegular: boolean }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [showB2B, showRegular]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/orders?page=${page}&sortField=${sortField}&sortDir=${sortDirection}&showB2B=${showB2B}&showRegular=${showRegular}&timestamp=${Date.now()}`,
          { cache: "no-store" }
        );

        if (response.ok) {
          const json = await response.json();
          setOrders(json.data);
          setTotalPages(json.totalPages);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, sortField, sortDirection, showB2B, showRegular]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  // Get badge variant based on order status
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "secondary"; // Gray
      case "PAID":
        return "default"; // Use default style for paid
      case "PROCESSING":
        return "default"; // Default
      case "SHIPPED":
        return "outline"; // Outline as info
      case "DELIVERED":
        return "default"; // Use default; custom colors could be added later
      case "CANCELLED":
        return "destructive"; // Red
      default:
        return "secondary";
    }
  };

  // Get status display name in Polish
  const getStatusDisplayName = (status: OrderStatus, paymentMethod?: string | null) => {
    switch (status) {
      case "PENDING":
        return "Oczekujące";
      case "PAID":
        return paymentMethod === "COD" ? "Opłacone (Pobranie)" : "Opłacone";
      case "PROCESSING":
        return "W realizacji";
      case "SHIPPED":
        return "Wysłane";
      case "DELIVERED":
        return "Dostarczone";
      case "CANCELLED":
        return "Anulowane";
      default:
        return status;
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  if (orders.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">Brak zamówień</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Ikona</span>
            </TableHead>
            <TableHead>Klient</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">
                Status
                {renderSortIcon("status")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
              <div className="flex items-center">
                Data utworzenia
                {renderSortIcon("createdAt")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("paidAt")}>
              <div className="flex items-center">
                Data płatności
                {renderSortIcon("paidAt")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("totalItems")}>
              <div className="flex items-center">
                Produkty
                {renderSortIcon("totalItems")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("totalAmount")}>
              <div className="flex items-center">
                Kwota (PLN)
                {renderSortIcon("totalAmount")}
              </div>
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const formattedTotal = (order.pricePaidInCents / 100).toFixed(2);
            const totalProducts = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    <ShoppingBag className="size-8 text-gray-500" />
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    {order.user.email}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusDisplayName(order.status, order.paymentMethod)}
                      </Badge>
                      {order.isB2BManual && (
                        <span className="text-xs text-muted-foreground">(B2B ręczne)</span>
                      )}
                    </div>
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    {format(new Date(order.createdAt), "dd.MM.yyyy | HH:mm")}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    {order.paidAt
                      ? format(new Date(order.paidAt), "dd.MM.yyyy | HH:mm")
                      : "—"}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    {totalProducts}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/zamowienia/${order.id}`}>
                    {formattedTotal}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <OrderActionsMenu
                    id={order.id}
                    currentStatus={order.status}
                    hasApaczkaOrderId={!!order.apaczkaOrderId}
                    wfirmaInvoiceId={order.wfirmaInvoiceId ?? null}
                    isB2BManual={!!order.isB2BManual}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
