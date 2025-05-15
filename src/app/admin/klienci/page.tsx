"use client";

import { Button } from "@/components/ui/button";
import PageHeader from "../_components/pageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  ChangeTypeDropdownItem,
  DeleteDropdownItem,
  EditClientDropdownItem,
} from "./_components/ClientActions";
import { useState, useEffect } from "react";
import AdminLoading from "../loading";

// Type for client data
type Client = {
  id: string;
  email: string;
  accountType: "ADMIN" | "DETAL" | "HURT";
  createdAt: string;
  orders: { pricePaidInCents: number }[];
  _count: { orders: number };
  totalSpent?: number; // Added for sorting
};

// Sorting type
type SortField = "accountType" | "createdAt" | "orders" | "totalSpent";
type SortDirection = "asc" | "desc";

export default function AdminClientsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Klienci</PageHeader>
        <Button>
          <Link href="/admin/klienci/new">Dodaj klienta</Link>
        </Button>
      </div>
      <ClientsTable />
    </>
  );
}

function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/clients?timestamp=${Date.now()}`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();

          // Calculate total spent for each client
          const clientsWithTotalSpent = data.map((client: Client) => {
            const totalSpent = client.orders.reduce(
              (sum: number, order: { pricePaidInCents: number }) =>
                sum + (order.pricePaidInCents || 0),
              0
            );
            return { ...client, totalSpent };
          });

          setClients(clientsWithTotalSpent);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
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
                  <User className="size-8 text-gray-500" />
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {format(new Date(client.createdAt), "dd.MM.yyyy      | HH:mm")}
                </TableCell>
                <TableCell>{client._count.orders}</TableCell>
                <TableCell>{formattedTotal}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="size-4 cursor-pointer" />
                      <span className="sr-only">Otwórz menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <EditClientDropdownItem id={client.id} />
                      <ChangeTypeDropdownItem id={client.id} currentType={accountType} />
                      <DropdownMenuSeparator />
                      <DeleteDropdownItem id={client.id} disabled={client._count.orders > 0} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
