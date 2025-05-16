"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Loading from "@/components/ui/loading";

function AdminSignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("admin-credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Niepoprawna nazwa użytkownika lub hasło");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Wystąpił błąd. Spróbuj ponownie.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-secondary/5">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Panel Administracyjny</CardTitle>
          <CardDescription className="text-center">
            Wprowadź dane administracyjne aby uzyskać dostęp
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nazwa użytkownika</Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nazwa-administratora"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logowanie..." : "Zaloguj jako Administrator"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading component for Suspense
function AdminSignInLoading() {
  return <Loading text="Wczytywanie panelu administracyjnego..." />;
}

export default function AdminSignIn() {
  return (
    <Suspense fallback={<AdminSignInLoading />}>
      <AdminSignInForm />
    </Suspense>
  );
}
