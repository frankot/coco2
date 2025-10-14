"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (json?.success) setSent(true);
      else setError("Wystąpił błąd");
    } catch (e) {
      setError("Wystąpił błąd");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Zapomniałeś hasła?</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div>
              <p>Wysłaliśmy link do resetu hasła jeśli konto o podanym adresie istnieje.</p>
              <p className="mt-4">
                <Link href="/auth/zaloguj" className="text-primary hover:underline">
                  Powrót do logowania
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600">{error}</div>}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
