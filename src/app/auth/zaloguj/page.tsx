"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Loading from "@/components/ui/loading";
import { Eye, EyeOff } from "lucide-react";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-12">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Zaloguj się
        </h1>
        <p className="mt-2 text-gray-500 text-center text-sm">
          Witaj ponownie w&nbsp;Dr.Coco
        </p>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
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
              className="h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Hasło</Label>
              <Link
                href="/auth/forgot"
                className="text-xs text-primary hover:underline"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>

        {/* Register */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Nie masz konta?{" "}
          <Link
            href={
              callbackUrl !== "/"
                ? `/auth/rejestracja?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/auth/rejestracja"
            }
            className="text-primary font-medium hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
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
