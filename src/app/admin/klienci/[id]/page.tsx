import PageHeader from "../../_components/pageHeader";
import prisma from "@/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdminLoading from "../../loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ChangeTypeButton, DeleteButton } from "../_components/ClientActions";

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
        orderBy: { createdAt: "desc" },
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

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informacje o kliencie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Typ konta</p>
              <Badge
                variant={
                  client.accountType === "ADMIN"
                    ? "destructive"
                    : client.accountType === "HURT"
                      ? "default"
                      : "secondary"
                }
              >
                {client.accountType}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Imię</p>
              <p className="font-medium">{client.firstName || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nazwisko</p>
              <p className="font-medium">{client.lastName || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data rejestracji</p>
              <p className="font-medium">
                {format(new Date(client.createdAt), "dd.MM.yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Łącznie wydane</p>
              <p className="font-medium">{(totalSpent / 100).toFixed(2)} PLN</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses Card */}
      <Card>
        <CardHeader>
          <CardTitle>Adresy ({client._count.addresses})</CardTitle>
        </CardHeader>
        <CardContent>
          {client.addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak dodanych adresów</p>
          ) : (
            <div className="space-y-4">
              {client.addresses.map((address) => (
                <div key={address.id} className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {address.street}, {address.postalCode} {address.city}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>
                      {address.phoneNumber && (
                        <p className="text-sm text-muted-foreground">Tel: {address.phoneNumber}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {address.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Domyślny
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {address.addressType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ostatnie zamówienia ({client._count.orders})</CardTitle>
        </CardHeader>
        <CardContent>
          {client.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak zamówień</p>
          ) : (
            <div className="space-y-3">
              {client.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/zamowienia/${order.id}`}
                  className="block border-l-2 border-primary pl-4 py-2 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-sm font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "dd.MM.yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">{(order.pricePaidInCents / 100).toFixed(2)} PLN</p>
                      <div className="flex gap-2 justify-end">
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "default"
                              : order.status === "CANCELLED"
                                ? "destructive"
                                : "secondary"
                          }
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
              {client._count.orders > 10 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Wyświetlono 10 z {client._count.orders} zamówień
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
