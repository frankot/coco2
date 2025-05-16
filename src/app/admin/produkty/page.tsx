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
import prisma from "@/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";


export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Produkty</PageHeader>
        <Button>
          <Link href="/admin/produkty/new">Dodaj produkt</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      isAvailable: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  if (products.length === 0)
    return <div className="text-center text-sm text-muted-foreground">Brak produktów</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Dostepnosc</span>
            </TableHead>
            <TableHead>Nazwa</TableHead>
            <TableHead>Cena</TableHead>
            <TableHead>Zamówienia</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailable ? (
                  <>
                    <span className="sr-only">Dostepne</span>
                    <CheckCircle2 className="size-8 text-green-500" />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Niedostepne</span>
                    <XCircle className="size-8 text-red-500" />
                  </>
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product._count.orders}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="size-4 cursor-pointer" />
                    <span className="sr-only">Otwórz menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/produkty/${product.id}`}>Edytuj</Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem id={product.id} isAvailable={product.isAvailable} />
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8 flex justify-end">
        <Button variant="destructive">
          <Link href="/admin/clean-db">Usuń wszystkie produkty</Link>
        </Button>
      </div>
    </>
  );
}
