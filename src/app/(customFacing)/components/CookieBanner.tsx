"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Text */}
        <p className="flex-1 text-sm text-gray-600">
          Używamy plików cookies, aby zapewnić prawidłowe działanie sklepu, zapamiętać Twój koszyk
          i ulepszać nasze usługi. Więcej informacji znajdziesz w{" "}
          <Link href="/cookies" className="text-primary underline hover:no-underline">
            Polityce cookies
          </Link>
          .
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={reject}
            className="rounded-full text-gray-600"
          >
            Odrzuć
          </Button>
          <Button size="sm" onClick={accept} className="rounded-full">
            Akceptuj
          </Button>
          <button
            onClick={reject}
            aria-label="Zamknij"
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
