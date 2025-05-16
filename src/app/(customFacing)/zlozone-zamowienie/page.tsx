"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Truck, Clock, ShoppingBag } from "lucide-react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentMethod = searchParams.get("payment");
  const [isClient, setIsClient] = useState(false);

  // Clear cart on successful order
  useEffect(() => {
    setIsClient(true);
    if (orderId) {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [orderId]);

  // If no order ID, show error
  if (isClient && !orderId) {
    return (
      <div className="container max-w-3xl py-10">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Nie znaleziono zamówienia</h1>
          <p className="mb-6 text-muted-foreground">
            Nie znaleźliśmy informacji o twoim zamówieniu.
          </p>
          <Button asChild>
            <Link href="/">Powrót do strony głównej</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card className="p-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Dziękujemy za zamówienie!</h1>
          <p className="text-muted-foreground">Twoje zamówienie zostało przyjęte do realizacji.</p>
        </div>

        <div className="bg-secondary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-medium">Numer zamówienia:</span>
          </div>
          <p className="text-lg font-mono ml-7">{orderId}</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Zamówienie przyjęte</h3>
              <p className="text-muted-foreground">
                Otrzymaliśmy Twoje zamówienie i przygotowujemy je do realizacji.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Szczegóły dostawy</h3>
              <p className="text-muted-foreground">
                Otrzymasz powiadomienie e-mail, gdy Twoje zamówienie zostanie wysłane.
              </p>
            </div>
          </div>
        </div>

        {paymentMethod === "BANK_TRANSFER" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Instrukcje płatności</h3>
            <p className="mb-4">Prosimy o wykonanie przelewu na poniższy rachunek bankowy:</p>
            <div className="bg-white p-3 rounded border">
              <p className="font-medium">Odbiorca: Sklep Coco</p>
              <p className="font-mono">Nr konta: 00 0000 0000 0000 0000 0000 0000</p>
              <p className="mt-2">Tytuł przelewu: Zamówienie {orderId}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Powrót do strony głównej</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sklep">Kontynuuj zakupy</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
