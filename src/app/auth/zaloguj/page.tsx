"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Loading from "@/components/ui/loading";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect admin login attempts to admin login page
  useState(() => {
    if (callbackUrl.startsWith("/admin")) {
      router.push("/admin/login");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("user-credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Niepoprawny email lub hasło");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Redirect to callback URL unless it's an admin URL
        router.push(callbackUrl.startsWith("/admin") ? "/" : callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Wystąpił błąd. Spróbuj ponownie.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Zaloguj się</CardTitle>
          <CardDescription className="text-center">
            Wprowadź dane dostępowe do swojego konta
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twój@email.com"
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
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p>
              Nie masz konta?{" "}
              <Link href="/auth/rejestracja" className="text-primary hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading component for Suspense
function SignInLoading() {
  return <Loading text="Wczytywanie..." />;
}

export default function SignIn() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}
