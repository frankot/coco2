"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Loading from "@/components/ui/loading";
import { userRegistrationSchema } from "@/lib/auth-utils";
import { Eye, EyeOff } from "lucide-react";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
      const validationResult = userRegistrationSchema.safeParse({
        email,
        password,
        firstName,
        lastName,
      });
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors
          .map((err) => err.message)
          .join(", ");
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
        body: JSON.stringify({ email, password, firstName, lastName, newsletterConsent }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Nie udało się utworzyć konta");
        setIsLoading(false);
        return;
      }

      // Automatically sign in the user after registration
      await signIn("user-credentials", {
        email,
        password,
        redirect: false,
      });

      router.push(callbackUrl);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Wystąpił błąd podczas połączenia z serwerem");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-12">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Utwórz konto
        </h1>
        <p className="mt-2 text-gray-500 text-center text-sm">
          Dołącz do społeczności Dr.Coco
        </p>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">Imię</Label>
              <Input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jan"
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nazwisko</Label>
              <Input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Kowalski"
                disabled={isLoading}
                className="h-11"
              />
            </div>
          </div>

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
            <Label htmlFor="password">Hasło</Label>
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="newsletterConsent"
              checked={newsletterConsent}
              onChange={(e) => setNewsletterConsent(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              disabled={isLoading}
            />
            <label htmlFor="newsletterConsent" className="text-sm cursor-pointer">
              Chcę otrzymywać newsletter z promocjami i nowościami
            </label>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Masz już konto?{" "}
          <Link
            href="/auth/zaloguj"
            className="text-primary font-medium hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
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
