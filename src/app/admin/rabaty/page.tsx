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
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/RabatyActions";
import { useState, useEffect, useCallback } from "react";
import AdminLoading from "../loading";
import { useRefresh } from "@/providers/RefreshProvider";
import { format } from "date-fns";
import Pagination from "../_components/Pagination";

type DiscountCode = {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountAmount: number;
  isActive: boolean;
  isSingleUse: boolean;
  usedCount: number;
  createdAt: string;
};

export default function AdminRabatyPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Rabaty</PageHeader>
        <Button>
          <Link href="/admin/rabaty/nowy">Dodaj kod</Link>
        </Button>
      </div>
      <RabatyTable />
    </>
  );
}

function RabatyTable() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { refreshCounter } = useRefresh();

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/rabaty?page=${page}&timestamp=${Date.now()}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const json = await response.json();
        setCodes(json.data);
        setTotalPages(json.totalPages);
      }
    } catch (error) {
      console.error("Error fetching discount codes:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes, refreshCounter]);

  const formatAmount = (code: DiscountCode) => {
    if (code.discountType === "PERCENTAGE") {
      return `${code.discountAmount}%`;
    }
    return `${(code.discountAmount / 100).toFixed(2)} PLN`;
  };

  if (loading) {
    return <AdminLoading />;
  }

  if (codes.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">Brak kodów rabatowych</div>;
  }

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Status</span>
          </TableHead>
          <TableHead>Kod</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead>Wartość</TableHead>
          <TableHead>Jednorazowy</TableHead>
          <TableHead>Użycia</TableHead>
          <TableHead>Data utworzenia</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Akcje</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
          <TableRow key={code.id}>
            <TableCell>
              {code.isActive ? (
                <CheckCircle2 className="size-6 text-green-500" />
              ) : (
                <XCircle className="size-6 text-red-500" />
              )}
            </TableCell>
            <TableCell className="font-mono font-medium">{code.code}</TableCell>
            <TableCell>
              {code.discountType === "PERCENTAGE" ? "Procentowy" : "Kwotowy"}
            </TableCell>
            <TableCell>{formatAmount(code)}</TableCell>
            <TableCell>{code.isSingleUse ? "Tak" : "Nie"}</TableCell>
            <TableCell>{code.usedCount}</TableCell>
            <TableCell>{format(new Date(code.createdAt), "dd.MM.yyyy")}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical className="size-4 cursor-pointer" />
                  <span className="sr-only">Otwórz menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ActiveToggleDropdownItem id={code.id} isActive={code.isActive} />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem id={code.id} disabled={code.usedCount > 0} />
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
