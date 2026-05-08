"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Wallet,
  ReceiptText,
  Percent,
  Package,
  ArrowUpRight,
  Book,
} from "lucide-react";
import Loading from "@/components/ui/loading";

type DashboardData = {
  productsCount: number;
  usersCount: number;
  ordersCount: number;
  pendingOrdersCount: number;
  paidOrdersCount: number;
  processingOrdersCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
  activeDiscountCodesCount: number;
  usedDiscountCodesCount: number;
  totalRevenueInCents: number;
  monthRevenueInCents: number;
  totalDiscountGrantedInCents: number;
  averageOrderValueInCents: number;
  statusDistribution: Array<{ status: string; count: number }>;
  ordersLast14Days: Array<{ date: string; orders: number; revenueInCents: number }>;
  latestOrders: Array<{
    id: string;
    status: string;
    pricePaidInCents: number;
    createdAt: string;
    email: string;
  }>;
};

const EMPTY_DASHBOARD: DashboardData = {
  productsCount: 0,
  usersCount: 0,
  ordersCount: 0,
  pendingOrdersCount: 0,
  paidOrdersCount: 0,
  processingOrdersCount: 0,
  shippedOrdersCount: 0,
  deliveredOrdersCount: 0,
  activeDiscountCodesCount: 0,
  usedDiscountCodesCount: 0,
  totalRevenueInCents: 0,
  monthRevenueInCents: 0,
  totalDiscountGrantedInCents: 0,
  averageOrderValueInCents: 0,
  statusDistribution: [],
  ordersLast14Days: [],
  latestOrders: [],
};

function formatPLN(valueInCents: number) {
  return `${(valueInCents / 100).toFixed(2)} PLN`;
}

function getStatusLabel(status: string) {
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
}

function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return "default";
    case "PROCESSING":
    case "SHIPPED":
      return "outline";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated as admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/");
      } else {
        // Fetch dashboard data
        const getDashboardData = async () => {
          try {
            // Fetch data using fetch API as a workaround
            const response = await fetch("/api/admin/dashboard");
            if (response.ok) {
              const data = await response.json();
              setStats(data);
            }
          } catch (error) {
            console.error("Error fetching dashboard data:", error);
          } finally {
            setIsLoading(false);
          }
        };

        getDashboardData();
      }
    }
  }, [session, status, router]);

  // Show loading while checking authentication or fetching data
  if (isLoading || status === "loading") {
    return <Loading text="Wczytywanie panelu administracyjnego..." />;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/readme">
            <Book className="h-4 w-4 mr-2" />
            Manual
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie zamówienia</CardTitle>
            <CardDescription>Najnowsze zamówienia z szybkim podglądem</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.latestOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Brak zamówień.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {stats.latestOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs ">#{order.id.slice(0, 7)}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{formatPLN(order.pricePaidInCents)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                      </p>
                    </div>

                    <Link
                      href={`/admin/zamowienia/${order.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Szczegóły
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Przychód łącznie</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPLN(stats.totalRevenueInCents)}</div>
                <p className="text-xs text-muted-foreground">
                  Suma zamówień opłaconych i realizowanych
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Przychód w miesiącu</CardTitle>
                <ReceiptText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPLN(stats.monthRevenueInCents)}</div>
                <p className="text-xs text-muted-foreground">Od początku bieżącego miesiąca</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wartość średniego koszyka</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPLN(stats.averageOrderValueInCents)}
                </div>
                <p className="text-xs text-muted-foreground">Średnio na 1 zamówienie</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rabat udzielony</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPLN(stats.totalDiscountGrantedInCents)}
                </div>
                <p className="text-xs text-muted-foreground">Łączna wartość wszystkich rabatów</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                <CardTitle className="text-sm font-medium">Produkty</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.productsCount}</div>
                <p className="text-xs text-muted-foreground">Łączna liczba produktów</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Klienci</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usersCount}</div>
                <p className="text-xs text-muted-foreground">Liczba zarejestrowanych klientów</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Zamówienia</CardTitle>
                <ReceiptText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ordersCount}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrdersCount} oczekujących • {stats.processingOrdersCount} w
                  realizacji
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kody rabatowe</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDiscountCodesCount}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.usedDiscountCodesCount} kodów zostało już użytych
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Zamówienia z ostatnich 14 dni</CardTitle>
                <CardDescription>Prosty wykres słupkowy liczby zamówień dziennie</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.ordersLast14Days.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex h-40 items-end gap-2">
                      {stats.ordersLast14Days.map((day) => {
                        const maxOrders = Math.max(
                          ...stats.ordersLast14Days.map((item) => item.orders),
                          1
                        );
                        const height = `${Math.max(8, (day.orders / maxOrders) * 100)}%`;

                        return (
                          <div key={day.date} className="flex-1">
                            <div
                              className="w-full rounded-sm bg-primary/80 transition-all hover:bg-primary"
                              style={{ height }}
                              title={`${day.orders} zamówień`}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-[10px] text-muted-foreground">
                      {stats.ordersLast14Days
                        .filter((_, index) => index % 2 === 0)
                        .map((day) => (
                          <div key={`label-${day.date}`} className="truncate">
                            {day.date.slice(5)}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak danych do wykresu.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Struktura statusów zamówień</CardTitle>
                <CardDescription>Rozkład wszystkich zamówień według statusu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.statusDistribution.length > 0 ? (
                  stats.statusDistribution.map((item) => {
                    const width = `${Math.max(4, (item.count / Math.max(stats.ordersCount, 1)) * 100)}%`;
                    return (
                      <div key={item.status} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{getStatusLabel(item.status)}</span>
                          <span className="text-muted-foreground">{item.count}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">Brak danych statusów.</p>
                )}

                <Separator className="my-2" />

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>Opłacone: {stats.paidOrdersCount}</div>
                  <div>Dostarczone: {stats.deliveredOrdersCount}</div>
                  <div>Wysłane: {stats.shippedOrdersCount}</div>
                  <div>Oczekujące: {stats.pendingOrdersCount}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
