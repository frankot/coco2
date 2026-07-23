"use client";

import { Button } from "@/components/ui/button";
import PageHeader from "../../_components/pageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableCellLink,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ActiveToggleButton,
  DeleteDropdownItem,
  GroupVisibilityToggleButton,
  VisibilityToggleButton,
} from "./_components/ProductActions";
import { useState, useEffect, useCallback } from "react";
import AdminLoading from "../loading";
import { useRouter } from "next/navigation";
import { useRefresh } from "@/providers/RefreshProvider";
import Pagination from "../../_components/Pagination";

// Type for product data
type Product = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  isVisible: boolean;
  isPreorder: boolean;
  visibleToDetal: boolean;
  visibleToDetalB2B: boolean;
  visibleToHurt: boolean;
  _count: { orderItems: number };
};

// Sorting type
type SortField = "price" | "orders" | "shop" | "groups" | "availability";
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
  const [sortField, setSortField] = useState<SortField | null>("shop");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { refreshCounter } = useRefresh();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?page=${page}&timestamp=${Date.now()}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const json = await response.json();
        setProducts(json.data);
        setTotalPages(json.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshCounter]);

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
        return multiplier * (a._count.orderItems - b._count.orderItems);

      case "shop":
        return multiplier * (Number(a.isVisible) - Number(b.isVisible));

      case "groups": {
        const groupScore = (product: Product) =>
          Number(product.visibleToDetal) * 4 +
          Number(product.visibleToDetalB2B) * 2 +
          Number(product.visibleToHurt);
        return multiplier * (groupScore(a) - groupScore(b));
      }

      case "availability": {
        const availabilityScore = (product: Product) =>
          product.isPreorder ? 2 : product.isAvailable ? 1 : 0;
        return multiplier * (availabilityScore(a) - availabilityScore(b));
      }

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
            <TableHead className="cursor-pointer" onClick={() => handleSort("shop")}>
              <div className="flex items-center">
                Sklep
                {renderSortIcon("shop")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("groups")}>
              <div className="flex items-center">
                Widoczność grup
                {renderSortIcon("groups")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("availability")}>
              <div className="flex items-center">
                Dostępność
                {renderSortIcon("availability")}
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
                <TableCellLink href={`/admin/produkty/${product.id}`}>{product.name}</TableCellLink>
              </TableCell>
              <TableCell>
                <TableCellLink href={`/admin/produkty/${product.id}`}>
                  {product.price}
                </TableCellLink>
              </TableCell>
              <TableCell>
                <TableCellLink href={`/admin/produkty/${product.id}`}>
                  {product._count.orderItems}
                </TableCellLink>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  <VisibilityToggleButton id={product.id} isVisible={product.isVisible} />
                  {product.isPreorder && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-800">
                      PREORDER
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <GroupVisibilityToggleButton
                    id={product.id}
                    field="visibleToDetal"
                    label="D"
                    active={product.isPreorder ? true : product.visibleToDetal}
                    disabled={product.isPreorder}
                    className="bg-blue-100 text-blue-800"
                  />
                  <GroupVisibilityToggleButton
                    id={product.id}
                    field="visibleToDetalB2B"
                    label="B2B"
                    active={product.isPreorder ? false : product.visibleToDetalB2B}
                    disabled={product.isPreorder}
                    className="bg-purple-100 text-purple-800"
                  />
                  <GroupVisibilityToggleButton
                    id={product.id}
                    field="visibleToHurt"
                    label="H"
                    active={product.isPreorder ? false : product.visibleToHurt}
                    disabled={product.isPreorder}
                    className="bg-orange-100 text-orange-800"
                  />
                </div>
              </TableCell>
              <TableCell>
                <ActiveToggleButton
                  id={product.id}
                  isAvailable={product.isPreorder ? true : product.isAvailable}
                  disabled={product.isPreorder}
                />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="size-4 cursor-pointer" />
                    <span className="sr-only">Otwórz menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/produkty/edytuj/${product.id}`}>Edytuj</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem id={product.id} disabled={product._count.orderItems > 0} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
