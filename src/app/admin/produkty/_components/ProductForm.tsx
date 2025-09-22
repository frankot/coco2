"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useRef, useActionState } from "react";
import { formatPLN } from "@/lib/formatter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct, updateProduct } from "../../_actions/products";
import type { Product } from "@/app/generated/prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

export default function ProductForm({ product }: { product?: Product | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [priceInCents, setPriceInCents] = useState<string>(product?.priceInCents?.toString() || "");
  const [description, setDescription] = useState<string>(product?.description || "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product?.imagePaths || []);
  const router = useRouter();

  const initialState = { error: {} };

  const [state, formAction, isPending] = useActionState(
    product
      ? (prevState: any, formData: FormData) => updateProduct(product.id, prevState, formData)
      : addProduct,
    initialState
  );

  // Handle successful form submission
  if (state?.success) {
    router.push("/admin/produkty");
    router.refresh();
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const customFormAction = (formData: FormData) => {
    // Add selected files to FormData
    selectedFiles.forEach((file, index) => {
      formData.append(`newImages`, file);
    });
    
    // Add existing images that weren't removed
    existingImages.forEach((imagePath) => {
      formData.append('existingImages', imagePath);
    });

    formAction(formData);
  };

  return (
    <form ref={formRef} action={customFormAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Nazwa</Label>
        <Input type="text" id="name" name="name" required defaultValue={product?.name || ""} />
        {state?.error?.name && <div className="text-destructive">{state.error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Cena w groszach</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(e.target.value)}
        />
        {state?.error?.priceInCents && (
          <div className="text-destructive">{state.error.priceInCents}</div>
        )}
        <div className="text-sm text-muted-foreground">
          {formatPLN(priceInCents ? Number(priceInCents) : 0)}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Textarea
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {state?.error?.description && (
          <div className="text-destructive">{state.error.description}</div>
        )}
      </div>
      
      {/* Images Section */}
      <div className="space-y-4">
        <Label>Zdjęcia produktu</Label>
        
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Aktualne zdjęcia:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImages.map((imagePath, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={imagePath}
                    alt={`Product image ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-md object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Główne
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Preview */}
        {selectedFiles.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Nowe zdjęcia:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`New image ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-md object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Images Button */}
        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Plus size={32} className="mx-auto mb-2 text-gray-400" />
              <span className="text-sm text-gray-600">Dodaj zdjęcia</span>
            </div>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {!product && existingImages.length === 0 && selectedFiles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Musisz dodać przynajmniej jedno zdjęcie produktu.
          </p>
        )}

        {state?.error?.image && <div className="text-destructive">{state.error.image}</div>}
      </div>

      {state?.error?._form && <div className="text-destructive">{state.error._form}</div>}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Dodawanie..." : product ? "Aktualizuj produkt" : "Dodaj produkt"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Wróć
        </Button>
      </div>
    </form>
  );
}
