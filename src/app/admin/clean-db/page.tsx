"use client";

import { Button } from "@/components/ui/button";
import { deleteAllProducts } from "../_actions/clean-db";
import { useState } from "react";

export default function CleanDbPage() {
  const [result, setResult] = useState<{ success?: boolean; message?: string }>(
    {}
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProducts = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL products? This cannot be undone."
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
        message: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Clean Database</h1>

      <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
        <p className="mb-6 text-red-600">
          This action will permanently delete ALL products from the database.
          This operation cannot be undone.
        </p>

        <Button
          variant="destructive"
          onClick={handleDeleteProducts}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete All Products"}
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
          {result.message}
        </div>
      )}
    </div>
  );
}
