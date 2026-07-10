"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import AdminLoading from "../../loading";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getOverrideCopy } from "../_components/OrderActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Type definitions
type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type Address = {
  id: string;
  street: string;
  phoneNumber?: string | null;
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
  subtotalInCents: number;
  shippingCostInCents: number;
  discountCodeValue?: string | null;
  discountAmountInCents?: number;
  createdAt: string;
  paidAt: string | null;
  status: OrderStatus;
  paymentMethod: string | null;
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
  // Apaczka / pickup metadata
  apaczkaOrderId?: string | null;
  apaczkaWaybillNumber?: string | null;
  apaczkaTrackingUrl?: string | null;
  apaczkaStatus?: string | null;
  apaczkaConfirmedAt?: string | null;
  apaczkaPointId?: string | null;
  apaczkaPointSupplier?: string | null;
  shippingServiceId?: string | null;
  shippingServiceName?: string | null;
  wfirmaInvoiceId?: string | null;
  wfirmaInvoiceNumber?: string | null;
  wfirmaInvoiceSentAt?: string | null;
  isB2BManual?: boolean;
  // Faktura data
  wantsFaktura?: boolean;
  companyName?: string | null;
  nip?: string | null;
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);
  const [labelDownloading, setLabelDownloading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState<
    "PAID" | "PROCESSING" | "SHIPPED" | null
  >(null);

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
    setStatusUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok) {
        if (status === "CANCELLED") {
          toast.success(`Zamówienie zostało anulowane`);
          router.push("/admin/zamowienia");
          return;
        }
        setOrder(data);
        if (data?.apaczkaSkippedReason === "B2B_MANUAL") {
          toast.warning("Zamówienie B2B/ręczne — Apaczka nie została utworzona");
        } else {
          toast.success(`Status zamówienia został zmieniony na ${getStatusDisplayName(status)}`);
        }
      } else {
        toast.error(data?.error || "Nie udało się zaktualizować statusu zamówienia");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Wystąpił błąd podczas aktualizacji statusu");
    } finally {
      setStatusUpdating(false);
    }
  };

  const downloadLabel = async () => {
    setLabelDownloading(true);
    try {
      const res = await fetch(`/api/admin/shipping/apaczka/waybill/${id}`);
      if (!res.ok) throw new Error("Nie udało się pobrać listu przewozowego");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `List_przewozowy_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Błąd pobierania listu przewozowego");
    } finally {
      setTimeout(() => setLabelDownloading(false), 5000);
    }
  };

  const downloadInvoice = async () => {
    setInvoiceDownloading(true);
    try {
      const response = await fetch(`/api/admin/invoices/${id}/download`);
      if (!response.ok) {
        throw new Error("Nie udało się pobrać faktury");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Faktura_${order?.wfirmaInvoiceNumber || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Błąd pobierania faktury");
    } finally {
      setTimeout(() => setInvoiceDownloading(false), 5000);
    }
  };

  // Get status display name in Polish
  const getStatusDisplayName = (status: OrderStatus, paymentMethod?: string | null) => {
    switch (status) {
      case "PENDING":
        return "Oczekujące";
      case "PAID":
        return paymentMethod === "COD" ? "Opłacone (Pobranie)" : "Opłacone";
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

  const getStatusBadgeClassName = (status: OrderStatus) => {
    if (status === "DELIVERED") {
      return "border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    }
    return undefined;
  };

  // Get badge variant based on order status
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PAID":
        return "default";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "outline";
      case "DELIVERED":
        return "outline";
      case "CANCELLED":
        return "destructive";
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
  const discountAmount = ((order.discountAmountInCents ?? 0) / 100).toFixed(2);

  // Delivery method label — shows what customer picked at checkout, no API calls
  const getDeliveryLabel = () => {
    if (order.isB2BManual) return "Dostawa ustalana indywidualnie";
    if (order.shippingServiceName) {
      let label = order.shippingServiceName;
      if (order.apaczkaPointSupplier) {
        label += ` — ${order.apaczkaPointSupplier}`;
        if (order.apaczkaPointId) label += ` (${order.apaczkaPointId})`;
      }
      return label;
    }
    if (order.shippingServiceId) {
      let label = `Usługa dostawy nr ${order.shippingServiceId}`;
      if (order.apaczkaPointSupplier) {
        label += ` — ${order.apaczkaPointSupplier}`;
        if (order.apaczkaPointId) label += ` (${order.apaczkaPointId})`;
      }
      return label;
    }
    return "—";
  };

  const confirmOverride = async () => {
    if (!overrideTarget) return;
    const target = overrideTarget;
    setOverrideTarget(null);
    await updateOrderStatus(target);
  };

  return (
    <div className="space-y-6">
      <Dialog
        open={overrideTarget !== null}
        onOpenChange={(o) => !o && setOverrideTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź zmianę statusu bez płatności</DialogTitle>
            <DialogDescription>{getOverrideCopy(overrideTarget, !!order?.isB2BManual)}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOverrideTarget(null)}>
              Anuluj
            </Button>
            <Button onClick={confirmOverride}>Potwierdź</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center gap-4">
               <Button variant="outline" asChild>
            <Link href="/admin/zamowienia">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do listy zamówień
            </Link>
          </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Zamówienie #{order.id.substring(0, 8)}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {order.status === "PENDING" && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={statusUpdating}>
                  Zmień status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setOverrideTarget("PAID")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Oznacz jako opłacone</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setOverrideTarget("PROCESSING")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>Rozpocznij realizację</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setOverrideTarget("SHIPPED")}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Oznacz jako wysłane</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {order.status === "PAID" && (
            <Button
              variant="outline"
              size="sm"
              disabled={statusUpdating}
              onClick={() => updateOrderStatus("PROCESSING")}
            >
              {statusUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}
              {statusUpdating
                ? order.isB2BManual
                  ? "Aktualizowanie..."
                  : "Wysyłanie do Apaczki..."
                : "Rozpocznij realizację"}
            </Button>
          )}
          {order.status === "PROCESSING" && (
            <Button
              variant="outline"
              size="sm"
              disabled={statusUpdating}
              onClick={() => updateOrderStatus("SHIPPED")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Oznacz jako wysłane
            </Button>
          )}
          {order.status === "SHIPPED" && (
            <Button
              variant="outline"
              size="sm"
              disabled={statusUpdating}
              onClick={() => updateOrderStatus("DELIVERED")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Oznacz jako dostarczone
            </Button>
          )}
          {(order.status === "PENDING" ||
            order.status === "PAID" ||
            order.status === "PROCESSING" ||
            order.status === "SHIPPED") && (
            <Button
              variant="destructive"
              size="sm"
              disabled={statusUpdating}
              onClick={() => updateOrderStatus("CANCELLED")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Anuluj zamówienie
            </Button>
          )}
   
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
              <div className="flex flex-wrap items-center gap-1">
                <Badge
                  variant={getStatusBadgeVariant(order.status)}
                  className={getStatusBadgeClassName(order.status)}
                >
                  {getStatusDisplayName(order.status, order.paymentMethod)}
                </Badge>
                {order.isB2BManual && (
                  <Badge variant="outline">B2B ręczne</Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground">Data utworzenia:</div>
              <div className="text-sm font-medium">
                {format(new Date(order.createdAt), "dd.MM.yyyy | HH:mm")}
              </div>

              <div className="text-sm text-muted-foreground">Data płatności:</div>
              <div className="text-sm font-medium">
                {order.paidAt
                  ? format(new Date(order.paidAt), "dd.MM.yyyy | HH:mm")
                  : "—"}
              </div>

              <div className="text-sm text-muted-foreground">Kwota:</div>
              <div className="text-sm font-medium">{totalAmount} PLN</div>

              <div className="text-sm text-muted-foreground">Metoda dostawy:</div>
              <div className="text-sm font-medium">{getDeliveryLabel()}</div>

              <div className="text-sm text-muted-foreground">Kod rabatowy:</div>
              <div className="text-sm font-medium">{order.discountCodeValue || "—"}</div>

              <div className="text-sm text-muted-foreground">Rabat:</div>
              <div className="text-sm font-medium">
                {(order.discountAmountInCents ?? 0) > 0 ? `-${discountAmount} PLN` : "—"}
              </div>

              <div className="text-sm text-muted-foreground">Liczba produktów:</div>
              <div className="text-sm font-medium">{order.orderItems.length}</div>

              <div className="text-sm text-muted-foreground">Numer faktury:</div>
              <div className="text-sm font-medium">{order.wfirmaInvoiceNumber || "—"}</div>

              <div className="text-sm text-muted-foreground">Wysłano fakturę:</div>
              <div className="text-sm font-medium">
                {order.wfirmaInvoiceSentAt
                  ? format(new Date(order.wfirmaInvoiceSentAt), "dd.MM.yyyy | HH:mm")
                  : "—"}
              </div>
            </div>


            <div className="flex flex-wrap gap-2">
              {!order.isB2BManual && order.wfirmaInvoiceId && (
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
              {!order.isB2BManual && order.apaczkaOrderId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadLabel}
                  disabled={labelDownloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {labelDownloading ? "Pobieranie..." : "Pobierz list przewozowy"}
                </Button>
              )}
            </div>

          </CardContent>
        </Card>

        {/* Customer details */}
        <Card className="relative">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="absolute top-4 right-4"
          >
            <Link href={`/admin/klienci/${order.user.id}`}>Zobacz profil klienta</Link>
          </Button>
          <CardHeader>
            <CardTitle>Dane klienta</CardTitle>
            <CardDescription>Informacje o kliencie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Email:</div>
              <div className="text-sm font-medium">{order.user.email}</div>

              <div className="text-sm text-muted-foreground">Imię:</div>
              <div className="text-sm font-medium">{order.user.firstName || "—"}</div>

              <div className="text-sm text-muted-foreground">Nazwisko:</div>
              <div className="text-sm font-medium">{order.user.lastName || "—"}</div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Adres dostawy</h3>
                <div className="grid grid-cols-1 gap-1">
                  <div className="text-sm">
                    <span className="font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </span>
                  </div>
                  <div className="text-sm">{order.shippingAddress.street}</div>
                  <div className="text-sm">{order.shippingAddress.phoneNumber || "—"}</div>
                  <div className="text-sm">
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </div>
                  <div className="text-sm">{order.shippingAddress.country}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Adres rozliczeniowy</h3>
                <div className="grid grid-cols-1 gap-1">
                  {order.wantsFaktura && order.companyName && (
                    <div className="text-sm font-semibold text-primary">{order.companyName}</div>
                  )}
                  {order.wantsFaktura && order.nip && (
                    <div className="text-sm">NIP: {order.nip}</div>
                  )}
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address + Products row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Apaczka delivery details — only after order is sent to Apaczka */}
        {order.apaczkaOrderId && (
          <Card>
            <CardHeader>
              <CardTitle>Dostawa (Apaczka)</CardTitle>
              <CardDescription>Szczegóły przesyłki wygenerowane przez Apaczkę</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-1">
                <div className="text-sm">
                  <span className="font-medium">Numer listu przewozowego:</span>
                  <div className="mt-1">{order.apaczkaWaybillNumber || "—"}</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status Apaczka:</span>
                  <div className="mt-1">{order.apaczkaStatus || "—"}</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">ID zlecenia Apaczka:</span>
                  <div className="mt-1">{order.apaczkaOrderId || "—"}</div>
                </div>
                {order.apaczkaTrackingUrl && (
                  <div className="text-sm">
                    <span className="font-medium">Śledzenie:</span>
                    <div className="mt-1">
                      <a
                        href={order.apaczkaTrackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {order.apaczkaTrackingUrl}
                      </a>
                    </div>
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium">Telefon do odbioru:</span>
                  <div className="mt-1">{order.shippingAddress.phoneNumber || "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order items */}
        <Card>
          <CardHeader>
            <CardTitle>Produkty</CardTitle>
            <CardDescription>Lista produktów w zamówieniu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
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
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end border-t pt-3 mt-2 pr-4 font-bold text-sm">
              Suma całkowita: <span className="ml-2">{totalAmount} PLN</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
