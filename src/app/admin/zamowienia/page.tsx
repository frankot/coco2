"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageHeader from "../_components/pageHeader";
import Link from "next/link";
import { deleteAllOrders } from "../_actions/clean-db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, ShoppingBag, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import AdminLoading from "../loading";
import {
  ViewOrderDropdownItem,
  UpdateStatusDropdownItem,
  CancelOrderDropdownItem,
  confirmAllApaczka,
  DownloadLabelDropdownItem,
} from "./_components/OrderActions";

// Type definitions
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
  status: OrderStatus;
  apaczkaOrderId?: string | null;
  apaczkaWaybillNumber?: string | null;
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
type SortField = "createdAt" | "status" | "totalItems" | "totalAmount";
type SortDirection = "asc" | "desc";

export default function AdminOrdersPage() {
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleDeleteAllOrders = async () => {
    if (
      !confirm("Czy na pewno chcesz usunąć WSZYSTKIE zamówienia? Tej operacji nie można cofnąć.")
    ) {
      return;
    }

    setIsDeletingAll(true);
    try {
      const result = await deleteAllOrders();
      if (result.success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(`Błąd: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Zamówienia</PageHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={async () => {
              try {
                const res = await confirmAllApaczka(true);
                const created = res.created?.length || 0;
                const failed = res.failed?.length || 0;
                // show toast instead of alert
                toast.success(`Utworzono w Apaczka: ${created}, błędy: ${failed}`);
                console.info("confirmAllApaczka result:", { created: res.created, failed: res.failed, turnIn: res.turnIn });
                if (res.turnIn) {
                  // Download base64 PDF
                  const link = document.createElement("a");
                  link.href = `data:application/pdf;base64,${res.turnIn}`;
                  link.download = `Zbiorcze_Potwierdzenie_Nadan_${Date.now()}.pdf`;
                  link.click();
                }
                window.location.reload();
              } catch (e: any) {
                toast.error(`Błąd potwierdzania Apaczka: ${e?.message ?? e}`);
                console.error("confirmAllApaczka error:", e);
              }
            }}
          >
            Potwierdź wszystkie w Apaczka
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
      <OrdersTable />
    </>
  );
}

function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/orders?timestamp=${Date.now()}`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;

    // Determine sort direction multiplier
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "createdAt":
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      case "status":
        const statusOrder = {
          PENDING: 0,
          PROCESSING: 1,
          SHIPPED: 2,
          DELIVERED: 3,
          CANCELLED: 4,
        };
        return multiplier * (statusOrder[a.status] - statusOrder[b.status]);

      case "totalItems":
        return multiplier * (a._count.orderItems - b._count.orderItems);

      case "totalAmount":
        return multiplier * (a.pricePaidInCents - b.pricePaidInCents);

      default:
        return 0;
    }
  });

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
  const getStatusDisplayName = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Oczekujące";
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
                Data zamówienia
                {renderSortIcon("createdAt")}
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
          {sortedOrders.map((order) => {
            // Format to PLN (złoty)
            const formattedTotal = (order.pricePaidInCents / 100).toFixed(2);

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <ShoppingBag className="size-8 text-gray-500" />
                </TableCell>
                <TableCell>
                  {order.user.email}
                  <div className="text-xs text-muted-foreground mt-1">
                    Typ: {order.user.accountType}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusDisplayName(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(order.createdAt), "dd.MM.yyyy | HH:mm")}</TableCell>
                <TableCell>{order._count.orderItems}</TableCell>
                <TableCell>{formattedTotal}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="size-4 cursor-pointer" />
                      <span className="sr-only">Otwórz menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <ViewOrderDropdownItem id={order.id} />
                      <UpdateStatusDropdownItem id={order.id} currentStatus={order.status} />
                      {order.apaczkaOrderId ? <DownloadLabelDropdownItem id={order.id} /> : null}
                      <DropdownMenuSeparator />
                      <CancelOrderDropdownItem
                        id={order.id}
                        disabled={order.status === "DELIVERED" || order.status === "CANCELLED"}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-8 flex justify-end">
        <Button variant="destructive">
          <Link href="/admin/clean-db">Usuń wszystkie zamówienia</Link>
        </Button>
      </div>
    </>
  );
}
