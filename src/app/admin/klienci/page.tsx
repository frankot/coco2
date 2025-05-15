import { Button } from "@/components/ui/button";
import PageHeader from "../_components/pageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/db";
import { MoreVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminClientsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Klienci</PageHeader>
      </div>
      <ClientsTable />
    </>
  );
}

async function ClientsTable() {
  const clients = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      accountType: true,
      createdAt: true,
      orders: {
        select: {
          pricePaidInCents: true,
        },
      },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (clients.length === 0)
    return <div className="text-center text-sm text-muted-foreground">Brak klientów</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Ikona</span>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Typ konta</TableHead>
            <TableHead>Data rejestracji</TableHead>
            <TableHead>Zamówienia</TableHead>
            <TableHead>Wydane (PLN)</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            // Calculate total amount spent
            const totalSpent = client.orders.reduce(
              (sum, order) => sum + (order.pricePaidInCents || 0),
              0
            );

            // Format to PLN (złoty)
            const formattedTotal = (totalSpent / 100).toFixed(2);

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
                <TableCell>{format(new Date(client.createdAt), "dd.MM.yyyy")}</TableCell>
                <TableCell>{client._count.orders}</TableCell>
                <TableCell>{formattedTotal}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="size-4 cursor-pointer" />
                      <span className="sr-only">Otwórz menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* Menu items will be added later as requested */}
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
