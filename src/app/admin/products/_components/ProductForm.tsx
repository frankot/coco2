"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useRef, useActionState } from "react";
import { formatPLN } from "@/lib/formatter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct } from "../../_actions/products";
import { useFormStatus } from "react-dom";

export default function ProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [priceInCents, setPriceInCents] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const initialState = { error: {} };
  const [state, formAction, isPending] = useActionState(addProduct, initialState);

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Nazwa</Label>
        <Input type="text" id="name" name="name" required />
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
        <Textarea id="description" name="description" required />
        {state?.error?.description && (
          <div className="text-destructive">{state.error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Zdjęcie</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              } else {
                setFileName("");
              }
            }}
          />
          {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
        </div>
        {state?.error?.image && <div className="text-destructive">{state.error.image}</div>}
      </div>
      {state?.error?._form && <div className="text-destructive">{state.error._form}</div>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Dodawanie..." : "Dodaj produkt"}
      </Button>
    </form>
  );
}
