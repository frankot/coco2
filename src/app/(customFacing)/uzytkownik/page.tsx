"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type Order = {
  id: string;
  pricePaidInCents: number;
  createdAt: string;
  status: OrderStatus;
  _count: {
    orderItems: number;
  };
};

type UserData = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  accountType: string;
  createdAt: string;
};

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/zaloguj");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          toast.error("Nie udało się pobrać danych profilu");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Wystąpił błąd podczas pobierania danych profilu");
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/user/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          toast.error("Nie udało się pobrać zamówień");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Wystąpił błąd podczas pobierania zamówień");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserData();
      fetchOrders();
    }
  }, [session]);

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

  if (status === "loading" || loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="container py-10 mt-20 mx-auto">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Zamówienia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Twój profil</CardTitle>
              <CardDescription>Twoje dane osobowe i ustawienia konta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Typ konta</p>
                  <p className="font-medium">
                    {userData?.accountType === "DETAL" ? "Detaliczny" : "Hurtowy"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Imię</p>
                  <p className="font-medium">{userData?.firstName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nazwisko</p>
                  <p className="font-medium">{userData?.lastName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{userData?.phoneNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data utworzenia konta</p>
                  <p className="font-medium">
                    {userData?.createdAt ? format(new Date(userData.createdAt), "dd.MM.yyyy") : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Twoje zamówienia</CardTitle>
              <CardDescription>Historia Twoich zamówień</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground">Brak zamówień</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numer zamówienia</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Produkty</TableHead>
                      <TableHead>Kwota (PLN)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            href={`/uzytkownik/${order.id}`}
                            className="text-primary hover:underline"
                          >
                            #{order.id.substring(0, 8)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {getStatusDisplayName(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt), "dd.MM.yyyy | HH:mm")}
                        </TableCell>
                        <TableCell>{order._count.orderItems}</TableCell>
                        <TableCell>{(order.pricePaidInCents / 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
