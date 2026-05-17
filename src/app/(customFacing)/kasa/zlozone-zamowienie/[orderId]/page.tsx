import prisma from "@/db";
import { formatPLN } from "@/lib/formatter";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VerifySessionClient from "../verifyClient";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getOrigin } from "@/lib/get-origin";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ success?: string; session_id?: string; token?: string; retry?: string }>;
}) {
  const { orderId } = await params;
  const search = await searchParams;
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
      <div className="container max-w-3xl py-10 ">
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

  // Authorize: signed-in owner OR matching one-time token
  const auth = await getServerSession(authOptions);
  const isOwner = auth?.user?.id && auth.user.id === order.userId;
  let tokenOk = false;
  if (!isOwner && search?.token && order.accessTokenHash) {
    const provided = crypto.createHash("sha256").update(search.token).digest("hex");
    tokenOk = provided === order.accessTokenHash;
  }
  if (!isOwner && !tokenOk) notFound();

  // Retry flow: redirect back to Stripe for the same order
  if (search?.retry === "true" && order.paymentMethod === "STRIPE" && order.status === "PENDING") {
    const origin = getOrigin();
    if (origin && order.orderItems.length > 0) {
      const lineItems = order.orderItems.map((item) => ({
        price_data: {
          currency: "pln",
          product_data: {
            name: item.product.name,
            images: item.product.imagePaths.length > 0 ? [item.product.imagePaths[0]] : [],
          },
          unit_amount: item.pricePerItemInCents,
        },
        quantity: item.quantity,
      }));

      let discounts: { coupon: string }[] = [];
      if (order.discountAmountInCents && order.discountAmountInCents > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: order.discountAmountInCents,
          currency: "pln",
          duration: "once",
          name: `Rabat: ${order.discountCodeValue || "kod"}`,
        });
        discounts = [{ coupon: coupon.id }];
      }

      const tokenParam = search?.token ? `&token=${encodeURIComponent(search.token)}` : "";
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik"],
        mode: "payment",
        locale: "pl",
        line_items: lineItems,
        ...(discounts.length > 0 ? { discounts } : {}),
        success_url: `${origin}/kasa/zlozone-zamowienie/${order.id}?success=true&session_id={CHECKOUT_SESSION_ID}${tokenParam}`,
        cancel_url: `${origin}/kasa?canceled=true`,
        metadata: { orderId: order.id },
      });

      if (checkoutSession.url) redirect(checkoutSession.url);
    }
  }

  const isStripePayment = order.paymentMethod === "STRIPE";
  const payment = order.payments[0];
  const isPaymentCompleted = payment?.status === "COMPLETED";
  const sessionId = search?.session_id;
  const verifyToken = search?.token;

  // Status Labels PL
  const statusLabels: Record<typeof order.status, string> = {
    PENDING: "Oczekujące",
    PAID: "Opłacone",
    PROCESSING: "W realizacji",
    SHIPPED: "Wysłane",
    DELIVERED: "Dostarczone",
    CANCELLED: "Anulowane",
  };

  return (
    <div className="container max-w-3xl py-10 mt-10">
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
          {sessionId ? (
            <VerifySessionClient sessionId={sessionId} orderId={orderId} token={verifyToken} />
          ) : null}
          <div>
            <h2 className="font-semibold mb-2">Numer zamówienia</h2>
            <p className="font-mono">{order.id}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Status zamówienia</h2>
            <p>{statusLabels[order.status]}</p>
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
