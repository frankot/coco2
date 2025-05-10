"use client";

import { Button } from "@/components/ui/button";
import { deleteAllProducts } from "../_actions/clean-db";
import { useState } from "react";

export default function CleanDbPage() {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    details?: {
      productsDeleted: number;
      imagesDeleted: number;
      imageErrors: number;
    };
  }>({});

  const [isDeleting, setIsDeleting] = useState(false);

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
        message: `Błąd: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Czyszczenie Bazy Danych</h1>

      <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Strefa Niebezpieczna</h2>
        <p className="mb-4 text-red-600">
          Ta akcja trwale usunie:
        </p>
        <ul className="list-disc pl-8 mb-6 text-red-600">
          <li>WSZYSTKIE produkty z bazy danych</li>
          <li>WSZYSTKIE powiązane obrazy z Cloudinary</li>
        </ul>
        <p className="mb-6 text-red-600 font-semibold">
          Tej operacji nie można cofnąć.
        </p>

        <Button
          variant="destructive"
          onClick={handleDeleteProducts}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          {isDeleting ? "Usuwanie..." : "Usuń Wszystkie Produkty i Obrazy"}
        </Button>
      </div>

      {result.message && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <p className="font-semibold mb-2">{result.message}</p>

          {result.details && (
            <div className="text-sm">
              <p>Usunięte produkty: {result.details.productsDeleted}</p>
              <p>Usunięte obrazy z Cloudinary: {result.details.imagesDeleted}</p>
              {result.details.imageErrors > 0 && (
                <p className="text-amber-600">
                  Obrazy z błędami usuwania: {result.details.imageErrors}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
