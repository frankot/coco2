import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items, totalAmount } = body;

    // Get the request headers
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const origin = process.env.NEXT_PUBLIC_URL || `${protocol}://localhost:3000`;

    if (!origin) {
      throw new Error("No origin header or NEXT_PUBLIC_URL found");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      mode: "payment",
      locale: "pl", // Set locale to Polish for proper BLIK display
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "pln", // BLIK only works with PLN currency
          product_data: {
            name: item.name,
            images: [item.imagePath],
          },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/kasa/zlozone-zamowienie/${orderId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/kasa?canceled=true`,
      metadata: {
        orderId: orderId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }
}
