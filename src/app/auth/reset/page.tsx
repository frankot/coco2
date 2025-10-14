"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPage() {
  const search = useSearchParams();
  const token = search.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("Brak tokenu resetującego");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) return setError("Brak tokenu");
    if (password.length < 6) return setError("Hasło musi mieć przynajmniej 6 znaków");
    if (password !== confirm) return setError("Hasła nie są identyczne");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (json?.success) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/zaloguj"), 1500);
      } else {
        setError(json?.message || "Wystąpił błąd");
      }
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
          <CardTitle className="text-2xl text-center">Ustaw nowe hasło</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success ? (
            <div>Hasło zostało zaktualizowane. Przekierowuję do logowania...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Nowe hasło</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm">Powtórz hasło</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Aktualizuję..." : "Ustaw nowe hasło"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
