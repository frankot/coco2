"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Loading from "@/components/ui/loading";
import { userRegistrationSchema } from "@/lib/auth-utils";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne");
      setIsLoading(false);
      return;
    }

    try {
      // Validate with zod schema
      const validationResult = userRegistrationSchema.safeParse({ email, password });
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map((err) => err.message).join(", ");
        setError(errorMessages);
        setIsLoading(false);
        return;
      }

      // Call the API endpoint to register the user
      const response = await fetch("/api/auth/rejestracja", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Nie udało się utworzyć konta");
      }

      // Automatically sign in the user after registration
      await signIn("user-credentials", {
        email,
        password,
        redirect: false,
      });

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Wystąpił błąd");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Utwórz konto</CardTitle>
          <CardDescription className="text-center">
            Wprowadź swój email i hasło aby się zarejestrować
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Masz już konto?{" "}
            <Link href="/auth/zaloguj" className="text-primary hover:underline">
              Zaloguj się
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Loading component for Suspense
function RegisterLoading() {
  return <Loading text="Wczytywanie..." />;
}

export default function Register() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
