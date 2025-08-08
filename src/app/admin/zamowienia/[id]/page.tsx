"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { ShoppingBag, ArrowLeft, Truck, Package, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import AdminLoading from "../../loading";
import { toast } from "sonner";

// Type definitions
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type Address = {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  pricePerItemInCents: number;
  product: {
    id: string;
    name: string;
    imageSrc: string;
    priceCents: number;
  };
};

type Order = {
  id: string;
  pricePaidInCents: number;
  createdAt: string;
  status: OrderStatus;
  user: {
    id: string;
    email: string;
    accountType: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
  };
  billingAddress: Address;
  shippingAddress: Address;
  orderItems: OrderItem[];
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched order data:", data); // Debug: Log fetched data
          setOrder(data);
        } else {
          toast.error("Nie udało się pobrać danych zamówienia");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Wystąpił błąd podczas pobierania zamówienia");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const updateOrderStatus = async (status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        toast.success(`Status zamówienia został zmieniony na ${getStatusDisplayName(status)}`);
      } else {
        toast.error("Nie udało się zaktualizować statusu zamówienia");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Wystąpił błąd podczas aktualizacji statusu");
    }
  };

  // Get status display name in Polish
  const getStatusDisplayName = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Oczekujące";
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
        return "secondary"; // Gray
      case "PROCESSING":
        return "default"; // Blue
      case "SHIPPED":
        return "warning"; // Yellow/Orange
      case "DELIVERED":
        return "success"; // Green
      case "CANCELLED":
        return "destructive"; // Red
      default:
        return "secondary";
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  if (!order) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold">Nie znaleziono zamówienia</h2>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/zamowienia">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć do listy zamówień
          </Link>
        </Button>
      </div>
    );
  }

  // Format to PLN (złoty)
  const totalAmount = (order.pricePaidInCents / 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Zamówienie #{order.id.substring(0, 8)}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/admin/zamowienia">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć do listy zamówień
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

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="font-medium">Zmień status</h3>
              <div className="flex flex-wrap gap-2">
                {order.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOrderStatus("PROCESSING")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Rozpocznij realizację
                  </Button>
                )}
                {order.status === "PROCESSING" && (
                  <Button variant="outline" size="sm" onClick={() => updateOrderStatus("SHIPPED")}>
                    <Truck className="mr-2 h-4 w-4" />
                    Oznacz jako wysłane
                  </Button>
                )}
                {order.status === "SHIPPED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOrderStatus("DELIVERED")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Oznacz jako dostarczone
                  </Button>
                )}
                {(order.status === "PENDING" ||
                  order.status === "PROCESSING" ||
                  order.status === "SHIPPED") && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateOrderStatus("CANCELLED")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Anuluj zamówienie
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer details */}
        <Card>
          <CardHeader>
            <CardTitle>Dane klienta</CardTitle>
            <CardDescription>Informacje o kliencie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">ID klienta:</div>
              <div className="text-sm font-medium">{order.user.id}</div>

              <div className="text-sm text-muted-foreground">Email:</div>
              <div className="text-sm font-medium">{order.user.email}</div>

              <div className="text-sm text-muted-foreground">Imię:</div>
              <div className="text-sm font-medium">{order.user.firstName || "—"}</div>

              <div className="text-sm text-muted-foreground">Nazwisko:</div>
              <div className="text-sm font-medium">{order.user.lastName || "—"}</div>

              <div className="text-sm text-muted-foreground">Telefon:</div>
              <div className="text-sm font-medium">{order.user.phoneNumber || "—"}</div>

              <div className="text-sm text-muted-foreground">Typ konta:</div>
              <div className="text-sm font-medium">
                {order.user.accountType === "DETAL"
                  ? "Detaliczny"
                  : order.user.accountType === "HURT"
                    ? "Hurtowy"
                    : order.user.accountType}
              </div>
            </div>

            <Separator className="my-4" />

            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/admin/klienci/${order.user.id}`}>Zobacz profil klienta</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Address details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Adres rozliczeniowy</CardTitle>
            <CardDescription>Dane do faktury</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-1">
              <div className="text-sm">
                <span className="font-medium">
                  {order.user.firstName} {order.user.lastName}
                </span>
              </div>
              <div className="text-sm">{order.billingAddress.street}</div>
              <div className="text-sm">
                {order.billingAddress.postalCode} {order.billingAddress.city}
              </div>
              <div className="text-sm">{order.billingAddress.country}</div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Adres dostawy</CardTitle>
            <CardDescription>Dane do wysyłki</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-1">
              <div className="text-sm">
                <span className="font-medium">
                  {order.user.firstName} {order.user.lastName}
                </span>
              </div>
              <div className="text-sm">{order.shippingAddress.street}</div>
              <div className="text-sm">
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </div>
              <div className="text-sm">{order.shippingAddress.country}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order items */}
      <Card className="mt-6">
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
