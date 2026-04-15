"use client";

import { Button } from "@/components/ui/button";
import PageHeader from "../../_components/pageHeader";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableCellLink,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, ArrowUpDown, ArrowUp, ArrowDown, Mail, Download } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ClientActionsMenu } from "./_components/ClientActions";
import { useState, useEffect, useCallback } from "react";
import AdminLoading from "../loading";
import { useRouter } from "next/navigation";
import { useRefresh } from "@/providers/RefreshProvider";
import Pagination from "../../_components/Pagination";

// Type for client data
type Client = {
  id: string;
  email: string;
  accountType: "ADMIN" | "DETAL" | "DETAL_B2B" | "HURT";
  createdAt: string;
  orders: { pricePaidInCents: number }[];
  _count: { orders: number };
  totalSpent?: number; // Added for sorting
};

// Sorting type
type SortField = "accountType" | "createdAt" | "orders" | "totalSpent";
type SortDirection = "asc" | "desc";

// Newsletter email type
type NewsletterEmail = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AdminClientsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Klienci</PageHeader>
        <div className="flex items-center gap-3">
          <NewsletterDialog />
          <Button asChild>
            <Link href="/admin/klienci/new">Dodaj klienta</Link>
          </Button>
        </div>
      </div>
      <ClientsTable />
    </>
  );
}

function NewsletterDialog() {
  const [emails, setEmails] = useState<NewsletterEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function fetchEmails() {
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/newsletter?limit=20&timestamp=${Date.now()}`, {
          cache: "no-store",
        });

        if (res.ok) setEmails(await res.json());
      } catch (err) {
        console.error("Error fetching newsletter emails:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, [isOpen]);

  const handleExportCSV = () => {
    window.open("/api/admin/newsletter?format=csv", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="size-4 mr-2" />
          Newsletter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Newsletter</DialogTitle>
          <DialogDescription>
            Ostatnie 20 adresow zapisanych do newslettera. Pelna lista jest dostepna w eksporcie
            CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" />
            <span>{loading ? "Ladowanie..." : `Widoczne rekordy: ${emails.length}`}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="size-4 mr-2" />
            Eksportuj CSV
          </Button>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Ladowanie zapisow...</p>
          ) : emails.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Brak zapisanych emaili</p>
          ) : (
            emails.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3"
              >
                <span className="min-w-0 truncate text-sm font-medium">{entry.email}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {format(new Date(entry.createdAt), "dd.MM.yyyy | HH:mm")}
                </span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { refreshCounter } = useRefresh();

  // Fetch clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/clients?page=${page}&timestamp=${Date.now()}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const json = await response.json();

        // Calculate total spent for each client
        const clientsWithTotalSpent = json.data.map((client: Client) => {
          const totalSpent = client.orders.reduce(
            (sum: number, order: { pricePaidInCents: number }) =>
              sum + (order.pricePaidInCents || 0),
            0
          );
          return { ...client, totalSpent };
        });

        setClients(clientsWithTotalSpent);
        setTotalPages(json.totalPages);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients, refreshCounter]);

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

  // Sort clients
  const sortedClients = [...clients].sort((a, b) => {
    if (!sortField) return 0;

    // Determine sort direction multiplier
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "accountType":
        return multiplier * a.accountType.localeCompare(b.accountType);

      case "createdAt":
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      case "orders":
        return multiplier * (a._count.orders - b._count.orders);

      case "totalSpent":
        return multiplier * ((a.totalSpent || 0) - (b.totalSpent || 0));

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

  if (loading) {
    return <AdminLoading />;
  }

  if (clients.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">Brak klientów</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Ikona</span>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="cursor-pointer hover:" onClick={() => handleSort("accountType")}>
              <div className="flex items-center">
                Typ konta
                {renderSortIcon("accountType")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:" onClick={() => handleSort("createdAt")}>
              <div className="flex items-center">
                Data rejestracji
                {renderSortIcon("createdAt")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:" onClick={() => handleSort("orders")}>
              <div className="flex items-center">
                Zamówienia
                {renderSortIcon("orders")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:" onClick={() => handleSort("totalSpent")}>
              <div className="flex items-center">
                Wydane (PLN)
                {renderSortIcon("totalSpent")}
              </div>
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClients.map((client) => {
            // Format to PLN (złoty)
            const formattedTotal = ((client.totalSpent || 0) / 100).toFixed(2);

            // Get account type (defaults to "DETAL" if not set)
            const accountType = client.accountType || "DETAL";

            return (
              <TableRow key={client.id}>
                <TableCell>
                  <TableCellLink href={`/admin/klienci/${client.id}`}>
                    <User className="size-8 text-gray-500" />
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/klienci/${client.id}`}>{client.email}</TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/klienci/${client.id}`}>
                    <Badge
                      variant={
                        accountType === "ADMIN"
                          ? "destructive"
                          : accountType === "HURT"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {accountType}
                    </Badge>
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/klienci/${client.id}`}>
                    {format(new Date(client.createdAt), "dd.MM.yyyy      | HH:mm")}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/klienci/${client.id}`}>
                    {client._count.orders}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <TableCellLink href={`/admin/klienci/${client.id}`}>
                    {formattedTotal}
                  </TableCellLink>
                </TableCell>
                <TableCell>
                  <ClientActionsMenu
                    id={client.id}
                    currentType={accountType}
                    hasOrders={client._count.orders > 0}
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
