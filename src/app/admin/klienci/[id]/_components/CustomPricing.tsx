"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPLN } from "@/lib/formatter";
import { toast } from "sonner";
import {
  getActiveProductsWithCustomPrices,
  upsertCustomPrice,
  deleteCustomPrice,
} from "@/app/admin/_actions/custom-prices";

type ProductWithCustomPrice = {
  id: string;
  name: string;
  priceInCents: number;
  imagePaths: string[];
  customPriceInCents: number | null;
};

export default function CustomPricing({ userId }: { userId: string }) {
  const [products, setProducts] = useState<ProductWithCustomPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getActiveProductsWithCustomPrices(userId).then((data) => {
      setProducts(data);
      const initial: Record<string, string> = {};
      for (const p of data) {
        if (p.customPriceInCents !== null) {
          initial[p.id] = (p.customPriceInCents / 100).toFixed(2).replace(".", ",");
        }
      }
      setCustomPrices(initial);
      setLoading(false);
    });
  }, [userId]);

  function handleSave(productId: string) {
    const value = customPrices[productId];
    if (!value || value.trim() === "") {
      toast.error("Wprowadź cenę");
      return;
    }

    const parsed = parseFloat(value.replace(",", "."));
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Nieprawidłowa cena");
      return;
    }

    const priceInCents = Math.round(parsed * 100);

    setSavingIds((prev) => new Set(prev).add(productId));
    startTransition(async () => {
      const result = await upsertCustomPrice({ userId, productId, priceInCents });
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      if (result.success) {
        toast.success(result.message);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, customPriceInCents: priceInCents } : p))
        );
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleDelete(productId: string) {
    setSavingIds((prev) => new Set(prev).add(productId));
    startTransition(async () => {
      const result = await deleteCustomPrice(userId, productId);
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      if (result.success) {
        toast.success(result.message);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, customPriceInCents: null } : p))
        );
        setCustomPrices((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      } else {
        toast.error(result.message);
      }
    });
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ceny indywidualne</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Ładowanie produktów...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ceny indywidualne</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak aktywnych produktów</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 border-b pb-3 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Cena domyślna: {formatPLN(product.priceInCents)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Cena PLN"
                      className="w-32 pr-8"
                      value={customPrices[product.id] ?? ""}
                      onChange={(e) =>
                        setCustomPrices((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSave(product.id);
                        }
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      zł
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSave(product.id)}
                    disabled={savingIds.has(product.id) || isPending}
                  >
                    Zapisz
                  </Button>
                  {product.customPriceInCents !== null && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      disabled={savingIds.has(product.id) || isPending}
                    >
                      Usuń
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
