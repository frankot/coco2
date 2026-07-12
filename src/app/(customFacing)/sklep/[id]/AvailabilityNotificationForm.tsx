"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GENERIC_MESSAGE = "Jeśli adres jest poprawny, wyślemy powiadomienie o dostępności.";

export default function AvailabilityNotificationForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/availability-notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.error || "Nie udało się zapisać powiadomienia");
        return;
      }

      const data = await response.json().catch(() => null);
      toast.success(data?.message || GENERIC_MESSAGE);
      setEmail("");
      setConsent(false);
    } catch {
      toast.error("Nie udało się zapisać powiadomienia");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="email"
        required
        placeholder="Twój adres e-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
        />
        <span>
          Wyrażam zgodę na kontakt e-mail w sprawie dostępności tego produktu.
        </span>
      </label>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 text-lg font-medium"
        size="lg"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Bell className="w-5 h-5 mr-2" />}
        Powiadom mnie o dostępności
      </Button>
    </form>
  );
}
