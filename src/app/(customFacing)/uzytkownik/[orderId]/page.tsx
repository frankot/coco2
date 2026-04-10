"use client";

import { useState, useEffect } from "react";
import { useParams, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowLeft, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderItem = {
  id: string;
  quantity: number;
  pricePerItemInCents: number;
  product: {
    id: string;
    name: string;
    imagePath: string;
    priceInCents: number;
  };
};

type Address = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type Order = {
  id: string;
  pricePaidInCents: number;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: "COD" | "STRIPE";
  billingAddress: Address;
  shippingAddress: Address;
  orderItems: OrderItem[];
  wfirmaInvoiceId?: string | null;
  wfirmaInvoiceNumber?: string | null;
  apaczkaTrackingUrl?: string | null;
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/zaloguj");
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/user/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrder();
    }
  }, [orderId, session]);

  // Invoice Download
  const downloadInvoice = async () => {
    setInvoiceDownloading(true);
    try {
      const response = await fetch(`/api/user/orders/${orderId}/invoice`);
      if (!response.ok) throw new Error("Nie udało się pobrać faktury");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Faktura_${order?.wfirmaInvoiceNumber || orderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Błąd pobierania faktury");
    } finally {
      setTimeout(() => setInvoiceDownloading(false), 5000);
    }
  };

  const retryStripePayment = async () => {
    if (!order) return;

    setIsRetryingPayment(true);
    try {
      const response = await fetch("/api/payments/stripe/retry-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Nie udało się ponowić płatności");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nie udało się ponowić płatności");
      setIsRetryingPayment(false);
    }
  };

  // Get status display name in Polish
  const getStatusDisplayName = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Oczekujące";
      case "PAID":
        return "Opłacone";
      case "PROCESSING":
        return "W realizacji";
      case "SHIPPED":
        return "Wysłane";
      case "DELIVERED":
        return "Dostarczone";
      case "CANCELLED":
        return "Anulowane";
      default:
        return status;
    }
  };

  // Get badge variant based on order status
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "outline";
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const OrderSkeleton = () => (
    <div className="container py-10 space-y-6  mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-56" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-40" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 items-center">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24 justify-self-end" />
            </div>
          ))}
          <div className="grid grid-cols-4 gap-4 items-center mt-4">
            <div className="col-span-3 text-right">
              <Skeleton className="h-4 w-32 ml-auto" />
            </div>
            <div className="justify-self-end">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (status === "loading" || loading) {
    return <OrderSkeleton />;
  }

  if (!order) {
    return (
      <div className="">
        <div className="text-center">
          <h2 className="text-xl font-bold">Nie znaleziono zamówienia</h2>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/uzytkownik">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do profilu
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format to PLN (złoty)
  const totalAmount = (order.pricePaidInCents / 100).toFixed(2);

  return (
    <div className="container py-10 space-y-6 mt-10 lg:mt-16 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Zamówienie #{order.id.substring(0, 8)}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/uzytkownik">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć do profilu
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order details */}
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły zamówienia</CardTitle>
            <CardDescription>Informacje o zamówieniu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">ID zamówienia:</div>
              <div className="text-sm font-medium">{order.id}</div>

              <div className="text-sm text-muted-foreground">Status:</div>
              <div>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {getStatusDisplayName(order.status)}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">Data zamówienia:</div>
              <div className="text-sm font-medium">
                {format(new Date(order.createdAt), "dd.MM.yyyy | HH:mm")}
              </div>

              <div className="text-sm text-muted-foreground">Kwota:</div>
              <div className="text-sm font-medium">{totalAmount} PLN</div>

              <div className="text-sm text-muted-foreground">Liczba produktów:</div>
              <div className="text-sm font-medium">{order.orderItems.length}</div>
            </div>

            {order.status === "PENDING" && order.paymentMethod === "STRIPE" && (
              <>
                <Separator />
                <Button size="sm" onClick={retryStripePayment} disabled={isRetryingPayment}>
                  {isRetryingPayment ? "Przekierowanie..." : "Ponów płatność online"}
                </Button>
              </>
            )}

            {/* Invoice & Tracking */}
            {(order.wfirmaInvoiceId || order.apaczkaTrackingUrl) && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {order.wfirmaInvoiceId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadInvoice}
                      disabled={invoiceDownloading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {invoiceDownloading ? "Pobieranie..." : "Pobierz fakturę"}
                    </Button>
                  )}
                  {order.apaczkaTrackingUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={order.apaczkaTrackingUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Śledź przesyłkę
                      </a>
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Address details */}
        <Card>
          <CardHeader>
            <CardTitle>Adresy</CardTitle>
            <CardDescription>Adresy dostawy i rozliczeniowy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Adres dostawy</h3>
              <div className="text-sm space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Adres rozliczeniowy</h3>
              <div className="text-sm space-y-1">
                <p>{order.billingAddress.street}</p>
                <p>
                  {order.billingAddress.postalCode} {order.billingAddress.city}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order items */}
      <Card>
        <CardHeader>
          <CardTitle>Produkty</CardTitle>
          <CardDescription>Lista produktów w zamówieniu</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Cena jednostkowa</TableHead>
                <TableHead>Ilość</TableHead>
                <TableHead className="text-right">Suma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item) => {
                const unitPrice = (item.pricePerItemInCents / 100).toFixed(2);
                const totalPrice = ((item.pricePerItemInCents * item.quantity) / 100).toFixed(2);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell>{unitPrice} PLN</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">{totalPrice} PLN</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Suma całkowita:
                </TableCell>
                <TableCell className="text-right font-bold">{totalAmount} PLN</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
