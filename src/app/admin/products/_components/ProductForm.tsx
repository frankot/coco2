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

export default function ProductForm({product}: {product?: Product | null}) {
    
  const formRef = useRef<HTMLFormElement>(null);
  const [priceInCents, setPriceInCents] = useState<string>(product?.priceInCents?.toString() || "");
  const [fileName, setFileName] = useState<string>(product?.imagePath || "");
  const [description, setDescription] = useState<string>(product?.description || "");
  const router = useRouter();

  const initialState = { error: {} };
  
  const [state, formAction, isPending] = useActionState(
    product 
      ? (prevState: any, formData: FormData) => updateProduct(product.id, prevState, formData)
      : addProduct, 
    initialState
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
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
      <div className="space-y-2">
        <Label htmlFor="image">Zdjęcie</Label>
        {product?.imagePath && (
          <div className="mb-4">
            <Image 
              src={product.imagePath} 
              alt={product.name || "Product image"} 
              width={200} 
              height={200} 
              className="rounded-md object-cover"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Aktualne zdjęcie produktu. Wybierz nowe zdjęcie tylko jeśli chcesz je zmienić.
            </p>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required={!product}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              } else {
                setFileName("");
              }
            }}
          />
          {fileName && !product?.imagePath && <span className="text-sm text-muted-foreground">{fileName}</span>}
        </div>
        {state?.error?.image && <div className="text-destructive">{state.error.image}</div>}
      </div>
      {state?.error?._form && <div className="text-destructive">{state.error._form}</div>}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Dodawanie..." : product ? "Aktualizuj produkt" : "Dodaj produkt"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
        >
          Wróć
        </Button>
      </div>
    </form>
  );
}
