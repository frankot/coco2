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

type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
  phoneNumber?: string | null;
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
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [editForm, setEditForm] = useState<Partial<Address>>({
    street: "",
    city: "",
    postalCode: "",
    country: "Polska",
    phoneNumber: "",
    addressType: "BOTH",
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/zaloguj");
  }

  useEffect(() => {
    // Sync active tab from URL param
    const tab = (searchParams.get("tab") as "profile" | "orders" | null) || (undefined as any);
    if (tab && ["profile", "orders"].includes(tab)) {
      setActiveTab(tab as any);
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setAddresses(data.addresses || []);
          // Load default address into state but do not start edit mode automatically
          const def = (data.addresses || []).find((a: Address) => a.isDefault) as
            | Address
            | undefined;
          if (def) {
            setDefaultAddress(def);
            setEditForm({
              street: def.street,
              city: def.city,
              postalCode: def.postalCode,
              country: def.country,
              phoneNumber: def.phoneNumber || "",
              addressType: def.addressType,
            });
          } else {
            setDefaultAddress(null);
          }
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
    const value = val as "profile" | "orders";
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const refreshAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const list = await res.json();
        setAddresses(list);
        const def = list.find((a: Address) => a.isDefault) as Address | undefined;
        if (def) {
          setDefaultAddress(def);
          setEditForm({
            street: def.street,
            city: def.city,
            postalCode: def.postalCode,
            country: def.country,
            phoneNumber: def.phoneNumber || "",
            addressType: def.addressType,
          });
        } else {
          setDefaultAddress(null);
          setEditForm({});
        }
      }
    } catch {}
  };

  // We'll use edit form to create/update the single default address
  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If editingId exists, PATCH; otherwise POST and set as default
      if (editingId) {
        const res = await fetch(`/api/user/addresses/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) throw new Error("Nie udało się zaktualizować adresu");
        toast.success("Zaktualizowano adres");
      } else {
        const payload = { ...(editForm as any), isDefault: true };
        const res = await fetch(`/api/user/addresses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Nie udało się dodać adresu");
        toast.success("Dodano adres");
      }
      // Ensure we refresh and reflect the new default address, then close edit UI
      await refreshAddresses();
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || "Błąd zapisu adresu");
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
      phoneNumber: a.phoneNumber || "",
      addressType: a.addressType,
    });
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
                  {/* Telefon przeniesiony do adresu */}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data utworzenia konta</p>
                    <p className="font-medium">
                      {userData?.createdAt
                        ? format(new Date(userData.createdAt), "dd.MM.yyyy")
                        : "—"}
                    </p>
                  </div>
                </div>
                {/* Simple default address box */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Adres dostawy</h3>
                  {loading ? (
                    <div className="p-4 border rounded-md text-sm text-muted-foreground">
                      Ładowanie adresu...
                    </div>
                  ) : defaultAddress && !editingId ? (
                    <div className="border rounded-md p-4 w-1/2 flex justify-between items-start">
                      <div>
                        <div className="font-medium">{defaultAddress.street}</div>
                        <div className="text-sm text-muted-foreground">
                          {defaultAddress.postalCode} {defaultAddress.city},{" "}
                          {defaultAddress.country}
                        </div>
                        {defaultAddress.phoneNumber && (
                          <div className="text-sm mt-1">Telefon: {defaultAddress.phoneNumber}</div>
                        )}
                      </div>
                      <div className="flex items-start gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(defaultAddress.id)}
                        >
                          Edytuj
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAddress(defaultAddress.id)}
                        >
                          Usuń
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Show inline form to add or edit address
                    <form className="space-y-3 border rounded-md p-4" onSubmit={submitEdit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Ulica i numer</Label>
                          <Input
                            value={editForm.street || ""}
                            onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Telefon</Label>
                          <Input
                            value={(editForm.phoneNumber as string) || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, phoneNumber: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Miasto</Label>
                          <Input
                            value={editForm.city || ""}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Kod pocztowy</Label>
                          <Input
                            value={editForm.postalCode || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, postalCode: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Kraj</Label>
                          <Input
                            value={editForm.country || "Polska"}
                            onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">Zapisz adres</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            // cancel editing
                            setEditingId(null);
                            // reset form to defaultAddress or empty
                            if (defaultAddress) {
                              setEditForm({
                                street: defaultAddress.street,
                                city: defaultAddress.city,
                                postalCode: defaultAddress.postalCode,
                                country: defaultAddress.country,
                                phoneNumber: defaultAddress.phoneNumber || "",
                                addressType: defaultAddress.addressType,
                              });
                            } else {
                              setEditForm({});
                            }
                          }}
                        >
                          Anuluj
                        </Button>
                      </div>
                    </form>
                  )}
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
      </Tabs>
    </div>
  );
}
