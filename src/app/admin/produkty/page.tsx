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
import { CheckCircle2, MoreVertical, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";
import { useState, useEffect, useCallback } from "react";
import AdminLoading from "../loading";
import { useRouter } from "next/navigation";
import { useRefresh } from "@/providers/RefreshProvider";

// Type for product data
type Product = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  _count: { orders: number };
};

// Sorting type
type SortField = "price" | "orders";
type SortDirection = "asc" | "desc";

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

function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const router = useRouter();
  const { refreshCounter } = useRefresh();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?timestamp=${Date.now()}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshCounter]); // Add refreshCounter as dependency

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

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;

    // Determine sort direction multiplier
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "price":
        return multiplier * (a.price - b.price);

      case "orders":
        return multiplier * (a._count.orders - b._count.orders);

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

  if (products.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">Brak produktów</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Dostepnosc</span>
            </TableHead>
            <TableHead>Nazwa</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
              <div className="flex items-center">
                Cena
                {renderSortIcon("price")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("orders")}>
              <div className="flex items-center">
                Zamówienia
                {renderSortIcon("orders")}
              </div>
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
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
