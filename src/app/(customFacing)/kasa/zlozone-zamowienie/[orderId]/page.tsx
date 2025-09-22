import { PrismaClient } from "@/app/generated/prisma";
import { formatPLN } from "@/lib/formatter";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ success?: string; session_id?: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  if (!order) {
    return (
      <div className="container max-w-3xl py-10">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Zamówienie nie znalezione</h1>
            <p className="text-muted-foreground mb-6">
              Nie mogliśmy znaleźć zamówienia o podanym identyfikatorze.
            </p>
            <Button asChild>
              <Link href="/sklep">Wróć do sklepu</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isStripePayment = order.paymentMethod === "STRIPE";
  const payment = order.payments[0];
  const isPaymentCompleted = payment?.status === "COMPLETED";

  return (
    <div className="container max-w-3xl py-10">
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {isPaymentCompleted ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : (
              <Loader2 className="w-12 h-12 animate-spin" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isPaymentCompleted ? "Dziękujemy za zamówienie!" : "Przetwarzamy płatność..."}
          </h1>
          <p className="text-muted-foreground">
            {isPaymentCompleted
              ? "Twoje zamówienie zostało potwierdzone"
              : "Prosimy o cierpliwość, przetwarzamy Twoją płatność"}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Numer zamówienia</h2>
            <p className="font-mono">{order.id}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Status zamówienia</h2>
            <p>{order.status}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Metoda płatności</h2>
            <p>
              {isStripePayment ? "Karta płatnicza" : "Przelew bankowy"}
              {isPaymentCompleted && " (Opłacone)"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Zamówione produkty</h2>
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Ilość: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {formatPLN(item.pricePerItemInCents * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Suma częściowa</span>
              <span>{formatPLN(order.subtotalInCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dostawa</span>
              <span>{formatPLN(order.shippingCostInCents)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2">
              <span>Razem</span>
              <span>{formatPLN(order.pricePaidInCents)}</span>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button asChild>
              <Link href="/sklep">Kontynuuj zakupy</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
