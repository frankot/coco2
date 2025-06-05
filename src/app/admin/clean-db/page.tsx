"use client";

import { Button } from "@/components/ui/button";
import { deleteAllProducts, deleteAllOrders } from "../_actions/clean-db";
import { useState } from "react";

export default function CleanDbPage() {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    details?: {
      productsDeleted?: number;
      imagesDeleted?: number;
      imageErrors?: number;
      ordersDeleted?: number;
    };
  }>({});

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingOrders, setIsDeletingOrders] = useState(false);

  const handleDeleteProducts = async () => {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć WSZYSTKIE produkty i powiązane z nimi obrazy z Cloudinary? Tej operacji nie można cofnąć."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAllProducts();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: `Błąd: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteOrders = async () => {
    if (
      !confirm("Czy na pewno chcesz usunąć WSZYSTKIE zamówienia? Tej operacji nie można cofnąć.")
    ) {
      return;
    }

    setIsDeletingOrders(true);
    try {
      const result = await deleteAllOrders();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: `Błąd: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsDeletingOrders(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Czyszczenie Bazy Danych</h1>

      <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Strefa Niebezpieczna</h2>

        <div className="mb-8">
          <p className="mb-4 text-red-600">Ta akcja trwale usunie:</p>
          <ul className="list-disc pl-8 mb-6 text-red-600">
            <li>WSZYSTKIE produkty z bazy danych</li>
            <li>WSZYSTKIE powiązane obrazy z Cloudinary</li>
          </ul>
          <p className="mb-6 text-red-600 font-semibold">Tej operacji nie można cofnąć.</p>

          <Button
            variant="destructive"
            onClick={handleDeleteProducts}
            disabled={isDeleting || isDeletingOrders}
            className="flex items-center gap-2"
          >
            {isDeleting ? "Usuwanie..." : "Usuń Wszystkie Produkty i Obrazy"}
          </Button>
        </div>

        <div className="pt-6 border-t border-red-200">
          <p className="mb-4 text-red-600">Ta akcja trwale usunie:</p>
          <ul className="list-disc pl-8 mb-6 text-red-600">
            <li>WSZYSTKIE zamówienia z bazy danych</li>
          </ul>
          <p className="mb-6 text-red-600 font-semibold">Tej operacji nie można cofnąć.</p>

          <Button
            variant="destructive"
            onClick={handleDeleteOrders}
            disabled={isDeleting || isDeletingOrders}
            className="flex items-center gap-2"
          >
            {isDeletingOrders ? "Usuwanie..." : "Usuń Wszystkie Zamówienia"}
          </Button>
        </div>
      </div>

      {result.message && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          <p className="font-semibold mb-2">{result.message}</p>

          {result.details && (
            <div className="text-sm">
              {result.details.productsDeleted !== undefined && (
                <p>Usunięte produkty: {result.details.productsDeleted}</p>
              )}
              {result.details.imagesDeleted !== undefined && (
                <p>Usunięte obrazy z Cloudinary: {result.details.imagesDeleted}</p>
              )}
              {result.details.imageErrors !== undefined && result.details.imageErrors > 0 && (
                <p className="text-amber-600">
                  Obrazy z błędami usuwania: {result.details.imageErrors}
                </p>
              )}
              {result.details.ordersDeleted !== undefined && (
                <p>Usunięte zamówienia: {result.details.ordersDeleted}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
