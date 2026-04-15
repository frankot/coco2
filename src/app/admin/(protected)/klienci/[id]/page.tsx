import PageHeader from "../../../_components/pageHeader";
import prisma from "@/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdminLoading from "../../loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, MapPin, CreditCard, Phone } from "lucide-react";
import { ChangeTypeButton, DeleteButton } from "../_components/ClientActions";
import CustomPricing from "./_components/CustomPricing";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<AdminLoading />}>
      <ClientDetailContent id={id} />
    </Suspense>
  );
}

async function ClientDetailContent({ id }: { id: string }) {
  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: {
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          pricePaidInCents: true,
          createdAt: true,
          paymentMethod: true,
          wantsFaktura: true,
          companyName: true,
          nip: true,
        },
      },
      _count: {
        select: {
          orders: true,
          addresses: true,
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  const totalSpent = client.orders.reduce((sum, order) => sum + (order.pricePaidInCents || 0), 0);

  // Company Info from latest faktura order
  const latestFaktura = client.orders.find((o) => o.wantsFaktura && o.companyName);

  // Split Addresses
  const billingAddresses = client.addresses.filter(
    (a) => a.addressType === "BILLING" || a.addressType === "BOTH"
  );
  const shippingAddresses = client.addresses.filter(
    (a) => a.addressType === "SHIPPING" || a.addressType === "BOTH"
  );

  const accountTypeVariant =
    client.accountType === "ADMIN"
      ? "destructive"
      : client.accountType === "HURT" || client.accountType === "DETAL_B2B"
        ? "default"
        : "secondary";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/klienci">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <PageHeader>Szczegóły klienta</PageHeader>
        </div>
        <div className="flex items-center gap-2">
          <ChangeTypeButton id={client.id} currentType={client.accountType} />
          <DeleteButton id={client.id} disabled={client._count.orders > 0} />
        </div>
      </div>

      {/* Top Grid: Client Info + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informacje o kliencie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium break-all">{client.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Imię</p>
                <p className="font-medium">{client.firstName || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nazwisko</p>
                <p className="font-medium">{client.lastName || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Typ konta</p>
                <Badge variant={accountTypeVariant}>{client.accountType}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ID klienta</p>
                <p className="font-mono text-xs break-all">{client.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Data rejestracji</p>
                <p className="font-medium text-sm">
                  {format(new Date(client.createdAt), "dd.MM.yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ostatnia aktualizacja</p>
                <p className="font-medium text-sm">
                  {format(new Date(client.updatedAt), "dd.MM.yyyy HH:mm")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats + Company */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Zamówienia</p>
                  <p className="text-2xl font-semibold">{client._count.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Adresy</p>
                  <p className="text-2xl font-semibold">{client._count.addresses}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Łącznie wydane</p>
                  <p className="text-2xl font-semibold">
                    {(totalSpent / 100).toFixed(2)}{" "}
                    <span className="text-sm font-normal">PLN</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          {latestFaktura && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Dane firmy (faktura)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Nazwa firmy</p>
                    <p className="font-medium">{latestFaktura.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">NIP</p>
                    <p className="font-medium font-mono">{latestFaktura.nip || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Źródło</p>
                    <Link
                      href={`/admin/zamowienia/${latestFaktura.id}`}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {latestFaktura.id}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Addresses Grid: Billing | Shipping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Adresy do faktury ({billingAddresses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {billingAddresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Brak adresów do faktury</p>
            ) : (
              <div className="space-y-3">
                {billingAddresses.map((address) => (
                  <AddressBlock key={address.id} address={address} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresy do dostawy ({shippingAddresses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shippingAddresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Brak adresów do dostawy</p>
            ) : (
              <div className="space-y-3">
                {shippingAddresses.map((address) => (
                  <AddressBlock key={address.id} address={address} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom Pricing for B2B/Hurt */}
      {(client.accountType === "HURT" || client.accountType === "DETAL_B2B") && (
        <CustomPricing userId={client.id} />
      )}

      {/* Orders Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ostatnie zamówienia ({client._count.orders})</CardTitle>
        </CardHeader>
        <CardContent>
          {client.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak zamówień</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {client.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/zamowienia/${order.id}`}
                  className="block border rounded-md p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), "dd.MM.yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                      <p className="font-medium">
                        {(order.pricePaidInCents / 100).toFixed(2)} PLN
                      </p>
                      <div className="flex gap-1 justify-end flex-wrap">
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "default"
                              : order.status === "CANCELLED"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {client._count.orders > 10 && (
            <p className="text-sm text-muted-foreground text-center pt-3">
              Wyświetlono 10 z {client._count.orders} zamówień
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddressBlock({
  address,
}: {
  address: {
    id: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string | null;
    isDefault: boolean;
    addressType: "BILLING" | "SHIPPING" | "BOTH";
    createdAt: Date;
  };
}) {
  return (
    <div className="border-l-2 border-primary pl-4 py-2">
      <div className="space-y-1">
        <p className="font-medium">{address.street}</p>
        <p className="text-sm">
          {address.postalCode} {address.city}
        </p>
        <p className="text-sm text-muted-foreground">{address.country}</p>
        {address.phoneNumber && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {address.phoneNumber}
          </p>
        )}
        <div className="flex gap-2 pt-1 flex-wrap">
          {address.isDefault && (
            <Badge variant="outline" className="text-xs">
              Domyślny
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {address.addressType}
          </Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            {format(new Date(address.createdAt), "dd.MM.yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}
