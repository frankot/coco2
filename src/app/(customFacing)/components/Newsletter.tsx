"use client";

import { useState } from "react";
import { CalendarCheck, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Wystąpił błąd");
        return;
      }

      setStatus("success");
      setMessage("Dziękujemy za zapisanie się do newslettera!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Wystąpił błąd połączenia");
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-primary py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg transition-all duration-500 ease-out">
            <span className="text-yellow-300 text-sm font-medium tracking-wider uppercase">
              NEWSLETTER DR.COCO®
            </span>
            <h2 className="mt-4 text-4xl text-white">Lubimy Cię. Zostańmy w kontakcie</h2>
            <p className="mt-4 text-lg text-white/80">
              Zostaw nam swój mail, a my będziemy dawać Ci znać o promocjach, nowych dropach i tym,
              co ciekawego dzieje się w świecie Dr. Coco. Bez lania wody (chyba, że kokosowej).
            </p>

            {status === "success" ? (
              <p className="mt-6 text-yellow-300 font-medium">{message}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex max-w-md gap-x-4">
                <Input
                  type="email"
                  required
                  placeholder="Twój adres email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  disabled={status === "loading"}
                />
                <Button
                  type="submit"
                  className="bg-yellow-300 text-primary hover:bg-yellow-400 font-medium px-6"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Zapisz się"
                  )}
                </Button>
              </form>
            )}
            {status === "error" && <p className="mt-2 text-red-300 text-sm">{message}</p>}
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2 transition-all duration-500 ease-out">
            <div className="flex flex-col items-start">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 group">
                <CalendarCheck className="size-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <dt className="mt-4 text-lg text-white">Co u nas słychać?</dt>
              <dd className="mt-2 text-base leading-7 text-white/70">
                Chętnie Ci powiemy. Będziesz na bieżąco z naszymi nowymi produktami, przepisami i
                ciekawostkami, których nie znajdziesz na stronie!
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 group">
                <ShieldCheck className="size-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <dt className="mt-4 text-lg text-white">Obiecujemy, że…</dt>
              <dd className="mt-2 text-base leading-7 text-white/70">
                …Twoje dane są u nas bezpieczne. Wysyłamy tylko to, co sami chcielibyśmy dostać,
                czyli kody zniżkowe i newsy, które faktycznie mają znaczenie.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-yellow-300/30 to-green-500/30 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
