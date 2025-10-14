"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifySessionClient({
  sessionId,
  orderId,
}: {
  sessionId?: string;
  orderId: string;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const verify = async () => {
      try {
        const res = await fetch("/api/payments/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, orderId }),
        });
        const data = await res.json();
        console.info("verify-session response", data);
        if (!mounted) return;
        if (data.success && data.paid) {
          toast.success("Płatność zakończona pomyślnie");
          // If Stripe provided a receipt URL, open it in a new tab (sandbox/testing)
          if (data.receiptUrl) {
            try {
              window.open(data.receiptUrl, "_blank");
            } catch (e) {
              console.info("Could not open receipt URL automatically", e);
            }
          }
          // Replace URL to remove session_id so we don't verify again
          router.replace(`/kasa/zlozone-zamowienie/${orderId}`);
        } else if (data.success && !data.paid) {
          toast.error("Płatność nie została zrealizowana");
          // remove session_id to avoid repeated attempts
          router.replace(`/kasa/zlozone-zamowienie/${orderId}`);
        } else {
          toast.error("Błąd weryfikacji płatności");
          router.replace(`/kasa/zlozone-zamowienie/${orderId}`);
        }
      } catch (e: any) {
        console.error("verify-session error", e);
        toast.error("Błąd weryfikacji płatności");
        if (mounted) router.replace(`/kasa/zlozone-zamowienie/${orderId}`);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [sessionId, orderId, router]);

  return null;
}
