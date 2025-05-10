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

import { CheckCircle2, XCircle } from "lucide-react";
export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Produkty</PageHeader>
        <Button>
          <Link href="/admin/products/new">Dodaj produkt</Link>
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
    return (
      <div className="text-center text-sm text-muted-foreground">
        Brak produktów
      </div>
    );

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
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
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
