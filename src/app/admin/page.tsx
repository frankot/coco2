"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShoppingBag } from "lucide-react";
import Loading from "@/components/ui/loading";

// Admin dashboard statistics component
function DashboardStats({
  productsCount,
  usersCount,
}: {
  productsCount: number;
  usersCount: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
          <CardTitle className="text-sm font-medium">Produkty</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsCount}</div>
          <p className="text-xs text-muted-foreground">Łączna liczba produktów</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Klienci</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersCount}</div>
          <p className="text-xs text-muted-foreground">Liczba zarejestrowanych klientów</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ productsCount: 0, usersCount: 0 });
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
        <h2 className="text-3xl font-bold tracking-tight">Panel Administracyjny</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats productsCount={stats.productsCount} usersCount={stats.usersCount} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
