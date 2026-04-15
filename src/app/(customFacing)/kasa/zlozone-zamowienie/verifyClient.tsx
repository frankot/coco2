"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifySessionClient({
  sessionId,
  orderId,
  token,
}: {
  sessionId?: string;
  orderId: string;
  token?: string;
}) {
  const [, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const cleanUrl = token
      ? `/kasa/zlozone-zamowienie/${orderId}?token=${encodeURIComponent(token)}`
      : `/kasa/zlozone-zamowienie/${orderId}`;

    const verify = async () => {
      try {
        const res = await fetch("/api/payments/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, orderId, token }),
        });
        const data = await res.json();
        if (!mounted) return;
        if (data.success && data.paid) {
          toast.success(
            data.pending
              ? "Płatność potwierdzona — księgowanie w toku"
              : "Płatność zakończona pomyślnie"
          );
          if (data.receiptUrl) {
            try {
              window.open(data.receiptUrl, "_blank");
            } catch {}
          }
          router.replace(cleanUrl);
        } else if (data.success && !data.paid) {
          toast.error("Płatność nie została zrealizowana");
          router.replace(cleanUrl);
        } else {
          toast.error("Błąd weryfikacji płatności");
          router.replace(cleanUrl);
        }
      } catch {
        toast.error("Błąd weryfikacji płatności");
        if (mounted) router.replace(cleanUrl);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [sessionId, orderId, token, router]);

  return null;
}
