import prisma from "@/db";
import { notFound } from "next/navigation";
import { formatPLN } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";
import { Pencil, ArrowLeft, Package, Eye, EyeOff } from "lucide-react";
import { ActiveToggleButton, DeleteButton } from "../_components/ProductActions";
import PageHeader from "../../_components/pageHeader";

export default async function ProductPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });

  if (!product) {
    notFound();
  }

  const composition =
    product.composition && typeof product.composition === "object"
      ? (product.composition as Record<string, string>)
      : null;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/produkty"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <PageHeader>{product.name}</PageHeader>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link
          href={`/admin/produkty/edytuj/${product.id}`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Pencil className="size-4" />
          Edytuj
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Aktywny:</span>
          <ActiveToggleButton id={product.id} isAvailable={product.isAvailable} />
        </div>

        <div className="ml-auto">
          <DeleteButton id={product.id} disabled={product._count.orderItems > 0} />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          {product.imagePaths.length > 0 ? (
            <>
              <div className="relative aspect-square rounded-lg overflow-hidden border ">
                <Image
                  src={product.imagePaths[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {product.imagePaths.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.imagePaths.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-md overflow-hidden border "
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-lg border  flex items-center justify-center">
              <Package className="size-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Price & status */}
          <div>
            <p className="text-3xl font-bold">{formatPLN(product.priceInCents)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {product.isAvailable ? "Produkt aktywny" : "Produkt nieaktywny"}
            </p>
          </div>

          {/* Visibility */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Widoczność</h3>
            <div className="flex gap-2">
              <VisibilityBadge label="Detal" active={product.visibleToDetal} />
              <VisibilityBadge label="B2B" active={product.visibleToDetalB2B} />
              <VisibilityBadge label="Hurt" active={product.visibleToHurt} />
            </div>
          </div>

          {/* Key info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Slug" value={product.slug || "—"} />
            <InfoField label="Szt. w opakowaniu" value={String(product.itemsPerPack)} />
            <InfoField label="Waga" value={`${product.weightKg} kg`} />
            <InfoField
              label="Wymiary"
              value={`${product.lengthCm} × ${product.widthCm} × ${product.heightCm} cm`}
            />
            <InfoField label="Zamówienia" value={String(product._count.orderItems)} />
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Opis</h3>
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Composition */}
          {composition && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Skład</h3>
              <div className="space-y-2 text-sm">
                {composition.ingredients && (
                  <div>
                    <span className="font-medium">Składniki: </span>
                    {composition.ingredients}
                  </div>
                )}
                {composition.storage && (
                  <div>
                    <span className="font-medium">Przechowywanie: </span>
                    {composition.storage}
                  </div>
                )}
                {composition.nutritionPerHundredMl && (
                  <div>
                    <span className="font-medium">Wartości odżywcze: </span>
                    {composition.nutritionPerHundredMl}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Markdown content */}
      {product.content && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Treść (Markdown)</h3>
          <div className="rounded-lg border bg-muted/50 p-4 text-sm whitespace-pre-wrap">
            {product.content}
          </div>
        </div>
      )}
    </>
  );
}

function VisibilityBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
        active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
      {label}
    </span>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
