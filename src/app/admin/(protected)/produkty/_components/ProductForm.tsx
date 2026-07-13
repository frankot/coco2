"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useRef, useActionState } from "react";
import { formatPLN } from "@/lib/formatter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct, updateProduct } from "../../../_actions/products";
import type { Product } from "@/app/generated/prisma/client";
import { slugify } from "@/lib/formatter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Plus, ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Link from "next/link";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

export default function ProductForm({ product }: { product?: Product | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [slug, setSlug] = useState<string>(product?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!product?.slug);
  const [pricePln, setPricePln] = useState<string>(
    product?.priceInCents != null ? (product.priceInCents / 100).toFixed(2) : ""
  );
  const [lastPricePln, setLastPricePln] = useState<string>(
    product?.lastPriceInCents != null ? (product.lastPriceInCents / 100).toFixed(2) : ""
  );
  const [preorderOriginalPricePln, setPreorderOriginalPricePln] = useState<string>(
    product?.preorderOriginalPriceInCents != null
      ? (product.preorderOriginalPriceInCents / 100).toFixed(2)
      : ""
  );
  const [isPreorder, setIsPreorder] = useState(product?.isPreorder ?? false);
  const [isAvailable, setIsAvailable] = useState(
    product?.isPreorder ? false : product?.isAvailable ?? true
  );
  const [description, setDescription] = useState<string>(product?.description || "");
  const [content, setContent] = useState<string>(product?.content || "");

  const initialComposition = product?.composition
    ? typeof product.composition === "string"
      ? JSON.parse(product.composition)
      : product.composition
    : { ingredients: "", storage: "", nutritionPerHundredMl: "" };
  const [composition, setComposition] = useState(initialComposition);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product?.imagePaths || []);
  const [imageError, setImageError] = useState<string | null>(null);
  const router = useRouter();

  const initialState = { error: {} };

  const [state, formAction, isPending] = useActionState(
    product
      ? (prevState: any, formData: FormData) => updateProduct(product.id, prevState, formData)
      : addProduct,
    initialState
  );

  if (state?.success) {
    router.push(product ? `/admin/produkty/${product.id}` : "/admin/produkty");
    router.refresh();
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const maxSize = 2 * 1024 * 1024;

      const oversizedFiles = files.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        setImageError("Rozmiar zdjęcia przekracza dopuszczalne 2MB");
        e.target.value = "";
        return;
      }

      setImageError(null);
      setSelectedFiles((prev) => [...prev, ...files]);
      e.target.value = "";
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const customFormAction = (formData: FormData) => {
    const toCents = (input: string | null | undefined) => {
      const raw = (input ?? "").trim();
      if (!raw) return 0;
      let s = raw.replace(/[\u00A0\s]/g, "");
      if (s.includes(",")) {
        s = s.replace(/\./g, "");
        s = s.replace(",", ".");
      }
      const num = parseFloat(s);
      return Number.isFinite(num) ? Math.round(num * 100) : 0;
    };

    const rawPln = (formData.get("pricePln") as string) ?? pricePln;
    const cents = toCents(rawPln);

    const rawLastPricePln = (formData.get("lastPricePln") as string) ?? lastPricePln;
    const lastPriceCents = rawLastPricePln.trim() ? toCents(rawLastPricePln) : null;

    const rawPreorderOriginalPricePln =
      (formData.get("preorderOriginalPricePln") as string) ?? preorderOriginalPricePln;
    const preorderOriginalPriceCents = rawPreorderOriginalPricePln.trim()
      ? toCents(rawPreorderOriginalPricePln)
      : null;

    formData.set("priceInCents", String(cents));
    formData.set("lastPriceInCents", lastPriceCents !== null ? String(lastPriceCents) : "");
    formData.set(
      "preorderOriginalPriceInCents",
      preorderOriginalPriceCents !== null ? String(preorderOriginalPriceCents) : ""
    );
    if (formData.get("isPreorder") === "on") {
      formData.set("isAvailable", "off");
    }
    formData.delete("pricePln");
    formData.delete("lastPricePln");
    formData.delete("preorderOriginalPricePln");
    formData.set("content", content);
    formData.set("composition", JSON.stringify(composition));

    selectedFiles.forEach((file) => {
      formData.append(`newImages`, file);
    });

    existingImages.forEach((imagePath) => {
      formData.append("existingImages", imagePath);
    });

    formAction(formData);
  };

  // Price preview
  const pricePreview = (() => {
    let s = (pricePln || "").replace(/[\u00A0\s]/g, "");
    if (s.includes(",")) {
      s = s.replace(/\./g, "");
      s = s.replace(",", ".");
    }
    const num = parseFloat(s);
    const cents = Number.isFinite(num) ? Math.round(num * 100) : 0;
    return formatPLN(cents);
  })();

  const lastPricePreview = (() => {
    let s = (lastPricePln || "").replace(/[\u00A0\s]/g, "");
    if (!s.trim()) return null;
    if (s.includes(",")) {
      s = s.replace(/\./g, "");
      s = s.replace(",", ".");
    }
    const num = parseFloat(s);
    const cents = Number.isFinite(num) ? Math.round(num * 100) : 0;
    return formatPLN(cents);
  })();

  const preorderOriginalPricePreview = (() => {
    let s = (preorderOriginalPricePln || "").replace(/[\u00A0\s]/g, "");
    if (!s.trim()) return null;
    if (s.includes(",")) {
      s = s.replace(/\./g, "");
      s = s.replace(",", ".");
    }
    const num = parseFloat(s);
    const cents = Number.isFinite(num) ? Math.round(num * 100) : 0;
    return formatPLN(cents);
  })();

  const preorderAvailableAtValue = product?.preorderAvailableAt
    ? new Date(product.preorderAvailableAt).toISOString().slice(0, 16)
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={product ? `/admin/produkty/${product.id}` : "/admin/produkty"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Wróć
              </Link>
            </Button>
            <Button type="submit" form="product-form" size="sm" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Zapisz
            </Button>
          </div>
          <h1 className="text-2xl font-bold pt-1">
            {product ? "Edytuj produkt" : "Nowy produkt"}
          </h1>
        </div>

        {/* Product Status */}
        <Card className="py-2 px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="isVisible"
                form="product-form"
                defaultChecked={product?.isVisible ?? true}
                className="h-3.5 w-3.5 accent-primary"
              />
              Widoczny w sklepie
            </label>
            <label className={`flex items-center gap-1.5 text-sm ${isPreorder ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}`}>
              <input
                type="checkbox"
                name="isAvailable"
                form="product-form"
                checked={!isPreorder && isAvailable}
                disabled={isPreorder}
                onChange={(event) => setIsAvailable(event.target.checked)}
                className="h-3.5 w-3.5 accent-primary disabled:opacity-50"
              />
              Dostępny do kupienia
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="isPreorder"
                form="product-form"
                checked={isPreorder}
                onChange={(event) => {
                  setIsPreorder(event.target.checked);
                  if (event.target.checked) setIsAvailable(false);
                }}
                className="h-3.5 w-3.5 accent-primary"
              />
              Preorder
            </label>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-sm font-medium text-muted-foreground">Grupy:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="visibleToDetal"
                form="product-form"
                defaultChecked={product?.visibleToDetal ?? true}
                className="h-3.5 w-3.5"
              />
              Detal
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="visibleToDetalB2B"
                form="product-form"
                defaultChecked={product?.visibleToDetalB2B ?? true}
                className="h-3.5 w-3.5"
              />
              B2B
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="visibleToHurt"
                form="product-form"
                defaultChecked={product?.visibleToHurt ?? true}
                className="h-3.5 w-3.5"
              />
              Hurt
            </label>
            <span className="text-muted-foreground/40">|</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                name="promo"
                form="product-form"
                defaultChecked={product?.promo ?? false}
                className="h-3.5 w-3.5 accent-primary"
              />
              Promocja
            </label>
          </div>
        </Card>
      </div>

      <form ref={formRef} id="product-form" action={customFormAction} className="space-y-6">
        {/* Nazwa + Slug */}
        <Card>
          <CardContent className="-mb-4 -mt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nazwa</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={product?.name || ""}
                  onChange={(e) => {
                    if (!slugManuallyEdited) {
                      setSlug(slugify(e.target.value));
                    }
                  }}
                />
                {state?.error?.name && <div className="text-destructive text-sm">{state.error.name}</div>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManuallyEdited(true);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nameInput = formRef.current?.querySelector<HTMLInputElement>("#name");
                      if (nameInput) {
                        setSlug(slugify(nameInput.value));
                        setSlugManuallyEdited(false);
                      }
                    }}
                  >
                    Generuj
                  </Button>
                </div>
                {state?.error?.slug && <div className="text-destructive text-sm">{state.error.slug}</div>}
                <p className="text-xs text-muted-foreground">
                  /sklep/<strong>{slug || "..."}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pricePln">{isPreorder ? "Cena sprzedaży / preorder (PLN)" : "Cena (PLN)"}</Label>
                  <Input
                    type="text"
                    id="pricePln"
                    name="pricePln"
                    inputMode="decimal"
                    required
                    value={pricePln}
                    onChange={(e) => setPricePln(e.target.value)}
                  />
                  {state?.error?.priceInCents && (
                    <div className="text-destructive text-sm">{state.error.priceInCents}</div>
                  )}
                  <p className="text-xs text-muted-foreground">{pricePreview}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="itemsPerPack">Szt. w opakowaniu</Label>
                  <Input
                    type="number"
                    id="itemsPerPack"
                    name="itemsPerPack"
                    min="1"
                    required
                    defaultValue={product?.itemsPerPack || 12}
                  />
                  {state?.error?.itemsPerPack && (
                    <div className="text-destructive text-sm">{state.error.itemsPerPack}</div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastPricePln">Najniższa cena z 30 dni (PLN)</Label>
                <Input
                  type="text"
                  id="lastPricePln"
                  name="lastPricePln"
                  inputMode="decimal"
                  placeholder={pricePreview}
                  value={lastPricePln}
                  onChange={(e) => setLastPricePln(e.target.value)}
                />
                {lastPricePreview && (
                  <p className="text-xs text-muted-foreground">{lastPricePreview}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Opcjonalne. Jeśli puste, użyta zostanie cena produktu.
                </p>
              </div>

              {isPreorder && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="preorderAvailableAt">Data i godzina zakończenia preorderu</Label>
                    <Input
                      type="datetime-local"
                      id="preorderAvailableAt"
                      name="preorderAvailableAt"
                      required={isPreorder}
                      defaultValue={preorderAvailableAtValue}
                    />
                    <p className="text-xs text-muted-foreground">
                      Po tej dacie klient nie będzie mógł kupić produktu w preorderze.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="preorderOriginalPricePln">Cena regularna do pokazania rabatu (PLN)</Label>
                    <Input
                      type="text"
                      id="preorderOriginalPricePln"
                      name="preorderOriginalPricePln"
                      inputMode="decimal"
                      required={isPreorder}
                      value={preorderOriginalPricePln}
                      onChange={(e) => setPreorderOriginalPricePln(e.target.value)}
                    />
                    {preorderOriginalPricePreview && (
                      <p className="text-xs text-muted-foreground">
                        {preorderOriginalPricePreview}. Cena sprzedaży/preorder to {pricePreview}.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="description">Opis (krótki)</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {state?.error?.description && (
                  <div className="text-destructive text-sm">{state.error.description}</div>
                )}
              </div>

              {/* Wymiary paczki */}
              <div className="grid grid-cols-4 gap-3 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="weightKg" className="text-xs text-muted-foreground">Waga (kg)</Label>
                  <Input
                    type="number"
                    id="weightKg"
                    name="weightKg"
                    step="0.1"
                    min="0.1"
                    defaultValue={product?.weightKg ?? 0.5}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lengthCm" className="text-xs text-muted-foreground">Długość (cm)</Label>
                  <Input
                    type="number"
                    id="lengthCm"
                    name="lengthCm"
                    min="1"
                    defaultValue={product?.lengthCm ?? 20}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="widthCm" className="text-xs text-muted-foreground">Szerokość (cm)</Label>
                  <Input
                    type="number"
                    id="widthCm"
                    name="widthCm"
                    min="1"
                    defaultValue={product?.widthCm ?? 15}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="heightCm" className="text-xs text-muted-foreground">Wysokość (cm)</Label>
                  <Input
                    type="number"
                    id="heightCm"
                    name="heightCm"
                    min="1"
                    defaultValue={product?.heightCm ?? 10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Zdjęcia produktu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Aktualne:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((imagePath, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={imagePath}
                          alt={`Product image ${index + 1}`}
                          width={150}
                          height={150}
                          className="rounded-md object-cover w-full h-24"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Główne
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {selectedFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Nowe:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          width={150}
                          height={150}
                          className="rounded-md object-cover w-full h-24"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload */}
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                  <Plus size={24} className="mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Dodaj zdjęcia</span>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>

              {!product && existingImages.length === 0 && selectedFiles.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Musisz dodać przynajmniej jedno zdjęcie produktu.
                </p>
              )}

              {imageError && <div className="text-destructive text-sm">{imageError}</div>}
              {state?.error?.image && <div className="text-destructive text-sm">{state.error.image}</div>}
            </CardContent>
          </Card>
        </div>

        {/* Markdown Content - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Pełna zawartość (Markdown)</CardTitle>
          </CardHeader>
          <CardContent suppressHydrationWarning>
            <input type="hidden" id="content" name="content" value={content} />
            <div data-color-mode="light">
              <MDEditor value={content} onChange={(val) => setContent(val || "")} preview="edit" />
            </div>
            <div data-color-mode="light" className="mt-3 rounded-md border p-4 prose prose-sm max-w-none min-h-[100px]">
              <MarkdownPreview source={content} />
            </div>
            {state?.error?.content && <div className="text-destructive text-sm mt-2">{state.error.content}</div>}
          </CardContent>
        </Card>

        {/* Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Skład i Wartość Odżywcza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ingredients">Skład</Label>
              <Textarea
                id="ingredients"
                placeholder="np. 100% woda kokosowa."
                value={composition.ingredients}
                onChange={(e) => setComposition({ ...composition, ingredients: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="storage">Przechowywanie</Label>
              <Textarea
                id="storage"
                placeholder="Przechowuj w suchym i chłodnym miejscu..."
                value={composition.storage}
                onChange={(e) => setComposition({ ...composition, storage: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nutrition">Wartość odżywcza na 100 ml</Label>
              <Textarea
                id="nutrition"
                placeholder="Wartość energetyczna (kJ/ kcal) - 79/19&#10;Tłuszcz (g) - 0..."
                value={composition.nutritionPerHundredMl}
                onChange={(e) =>
                  setComposition({ ...composition, nutritionPerHundredMl: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Errors & Actions */}
        {state?.error?._form && <div className="text-destructive text-sm">{state.error._form}</div>}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Zapisywanie..." : product ? "Zapisz zmiany" : "Dodaj produkt"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Anuluj
          </Button>
        </div>
      </form>
    </div>
  );
}
