"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { ShoppingBag, User, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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
  addresses?: Address[];
};

type Address = {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: "BILLING" | "SHIPPING" | "BOTH";
  createdAt: string;
  updatedAt: string;
};

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Polska",
    isDefault: false,
    addressType: "BOTH" as "BILLING" | "SHIPPING" | "BOTH",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Address>>({});

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/zaloguj");
  }

  useEffect(() => {
    // Sync active tab from URL param
    const tab = (searchParams.get("tab") as "profile" | "orders" | "addresses" | null) ||
      (undefined as any);
    if (tab && ["profile", "orders", "addresses"].includes(tab)) {
      setActiveTab(tab as any);
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setAddresses(data.addresses || []);
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

  const onTabChange = (val: string) => {
    const value = val as "profile" | "orders" | "addresses";
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const refreshAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) setAddresses(await res.json());
    } catch {}
  };

  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (!res.ok) throw new Error("Nie udało się dodać adresu");
      toast.success("Dodano adres");
      setAddressForm({
        street: "",
        city: "",
        postalCode: "",
        country: "Polska",
        isDefault: false,
        addressType: "BOTH",
      });
      refreshAddresses();
    } catch (err: any) {
      toast.error(err.message || "Błąd dodawania adresu");
    }
  };

  const makeDefault = async (id: string, addressType: Address["addressType"]) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true, addressType }),
      });
      if (!res.ok) throw new Error("Nie udało się ustawić domyślnego adresu");
      toast.success("Ustawiono jako domyślny");
      refreshAddresses();
    } catch (err: any) {
      toast.error(err.message || "Błąd aktualizacji adresu");
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "Nie udało się usunąć adresu");
      }
      toast.success("Adres usunięty");
      refreshAddresses();
    } catch (err: any) {
      toast.error(err.message || "Błąd usuwania adresu");
    }
  };

  const startEdit = (a: Address) => {
    setEditingId(a.id);
    setEditForm({
      street: a.street,
      city: a.city,
      postalCode: a.postalCode,
      country: a.country,
      addressType: a.addressType,
    });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await fetch(`/api/user/addresses/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Nie udało się zaktualizować adresu");
      toast.success("Zaktualizowano adres");
      setEditingId(null);
      setEditForm({});
      refreshAddresses();
    } catch (err: any) {
      toast.error(err.message || "Błąd aktualizacji adresu");
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

  const ProfileSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const OrdersSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20 justify-self-end" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AddressesSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border rounded-md p-3 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-10 mt-20 mx-auto">
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Zamówienia
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {loading ? (
            <ProfileSkeleton />
          ) : (
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
                      {userData?.createdAt
                        ? format(new Date(userData.createdAt), "dd.MM.yyyy")
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {loading ? (
            <OrdersSkeleton />
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="addresses">
          {loading ? (
            <AddressesSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Twoje adresy</CardTitle>
                <CardDescription>Zarządzaj adresami dostawy i rozliczeniowymi</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-2">Zapisane adresy</h3>
                  <div className="space-y-4">
                    {addresses.length === 0 && (
                      <p className="text-sm text-muted-foreground">Brak zapisanych adresów</p>
                    )}
                    {addresses.map((a) => (
                      <div key={a.id} className="border rounded-md p-3">
                        {editingId === a.id ? (
                          <form className="space-y-2" onSubmit={submitEdit}>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label>Ulica</Label>
                                <Input
                                  value={editForm.street || ""}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, street: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Miasto</Label>
                                <Input
                                  value={editForm.city || ""}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, city: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Kod pocztowy</Label>
                                <Input
                                  value={editForm.postalCode || ""}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, postalCode: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Kraj</Label>
                                <Input
                                  value={editForm.country || ""}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, country: e.target.value })
                                  }
                                />
                              </div>
                              <div className="col-span-2">
                                <Label>Typ adresu</Label>
                                <select
                                  className="w-full border rounded-md h-9 px-3"
                                  value={editForm.addressType || "BOTH"}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, addressType: e.target.value as any })
                                  }
                                >
                                  <option value="BOTH">Oba</option>
                                  <option value="SHIPPING">Dostawa</option>
                                  <option value="BILLING">Rozliczeniowy</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" size="sm">
                                Zapisz
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                              >
                                Anuluj
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{a.street}</div>
                              <div className="text-sm text-muted-foreground">
                                {a.postalCode} {a.city}, {a.country}
                              </div>
                              <div className="text-xs mt-1">Typ: {a.addressType}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => startEdit(a)}>
                                Edytuj
                              </Button>
                              {a.isDefault ? (
                                <Badge>Domyślny</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => makeDefault(a.id, a.addressType)}
                                >
                                  Ustaw domyślny
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteAddress(a.id)}
                              >
                                Usuń
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Dodaj nowy adres</h3>
                  <form className="space-y-3" onSubmit={submitAddress}>
                    <div className="space-y-1">
                      <Label>Ulica</Label>
                      <Input
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Miasto</Label>
                        <Input
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Kod pocztowy</Label>
                        <Input
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, postalCode: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Kraj</Label>
                      <Input
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, country: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <input
                        id="default"
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, isDefault: e.target.checked })
                        }
                      />
                      <Label htmlFor="default">Ustaw jako domyślny</Label>
                    </div>
                    <div className="space-y-1">
                      <Label>Typ adresu</Label>
                      <select
                        className="w-full border rounded-md h-9 px-3"
                        value={addressForm.addressType}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, addressType: e.target.value as any })
                        }
                      >
                        <option value="BOTH">Oba</option>
                        <option value="SHIPPING">Dostawa</option>
                        <option value="BILLING">Rozliczeniowy</option>
                      </select>
                    </div>
                    <Button type="submit">Zapisz adres</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
