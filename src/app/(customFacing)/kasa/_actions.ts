"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrUpdateUser } from "@/lib/auth-utils";
import mailer from "@/lib/mailer";

function normalizePhonePL(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D+/g, "");
  // Accept 9-digit local or 11-digit starting with 48 or 12 with 0048
  if (digits.length === 9) return "+48" + digits;
  if (digits.length === 11 && digits.startsWith("48")) return "+" + digits;
  if (digits.length === 12 && digits.startsWith("0048")) return "+" + digits.slice(2);
  if (digits.startsWith("+48") && digits.length === 12) return "+" + digits.slice(1);
  // Already E.164 like +48123456789
  if (input.startsWith("+48") && digits.length === 11) return input;
  return null;
}

// Define the schema for order submission
const orderFormSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Niepoprawny adres email"),
  phoneNumber: z.string().min(1, "Numer telefonu jest wymagany"),
  street: z.string().min(1, "Ulica jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
  country: z.string().default("Polska"),
  paymentMethod: z.enum(["COD", "STRIPE"]),
  // Accept COD as a payment method too
  // Note: DB currently contains BANK_TRANSFER for historical entries. New orders should use COD.
  shippingMethodId: z.string().min(1, "Wybierz metodę dostawy"),
  cartItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      priceInCents: z.number(),
      quantity: z.number().min(1),
      imagePath: z.string(),
    })
  ),
  userId: z.string().optional(),
  apaczkaPointId: z.string().optional(),
  apaczkaPointSupplier: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export async function createOrder(formData: OrderFormData) {
  try {
    console.log("Received form data:", JSON.stringify(formData, null, 2));

    // Validate form data
    const validatedData = orderFormSchema.parse(formData);
    console.log("Validation passed");

    // Get product IDs from cart
    const productIds = validatedData.cartItems.map((item) => item.id);

    // Check if products exist in the database
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isAvailable: true,
      },
    });
    console.log(`Found ${existingProducts.length} products in database`);

    // Build a map of DB products for price lookups
    const productMap = new Map(existingProducts.map((p) => [p.id, p]));

    // Verify all cart items have corresponding products
    const missingProducts = validatedData.cartItems.filter(
      (item) => !productMap.has(item.id)
    );

    if (missingProducts.length > 0) {
      console.log("Missing products:", missingProducts);
      return {
        success: false,
        error: `Niektóre produkty nie są dostępne: ${missingProducts.map((p) => p.name).join(", ")}`,
      };
    }

    if (existingProducts.length === 0) {
      console.log("No products found in database");
      return {
        success: false,
        error: "Nie znaleziono żadnych produktów w bazie danych",
      };
    }

    // Calculate total price using DB prices — never trust client-provided prices
    const subtotalInCents = validatedData.cartItems.reduce(
      (sum, item) => sum + productMap.get(item.id)!.priceInCents * item.quantity,
      0
    );

    // Set default values for required fields
    // TODO: integrate Apaczka order_valuation to compute exact price.
    const shippingCostInCents = 1500; // Placeholder: 15 PLN in cents
    const totalPriceInCents = subtotalInCents + shippingCostInCents;

    // Handle user - first check if a userId was provided or if there's a logged in user
    let userId = validatedData.userId;

    // If no userId was provided, try to get it from the session
    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id;
      console.log("Found userId from session:", userId);
    }

    // If we still don't have a userId, use createOrUpdateUser function
    if (!userId) {
      console.log("No userId found, creating or updating user with data:", {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });

      const userResult = await createOrUpdateUser({
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });

      console.log("User creation/update result:", userResult);

      if (!userResult.success) {
        return { success: false, error: userResult.message };
      }

      userId = userResult.userId;
      console.log("Assigned userId:", userId);
    }

    // Verify the user exists before proceeding
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      console.log("User not found in database:", userId);
      return { success: false, error: "Nie znaleziono użytkownika. Zaloguj się lub utwórz konto." };
    }

    // Now userId is definitely not undefined - if we got here, userId exists and is valid
    const verifiedUserId = userId as string;
    console.log("Verified userId:", verifiedUserId);

    // Validate phone before entering transaction
    const normalizedPhone = normalizePhonePL(validatedData.phoneNumber);
    if (!normalizedPhone) {
      return {
        success: false,
        error: "Niepoprawny numer telefonu. Podaj 9 cyfr (PL) lub numer z prefiksem +48.",
      };
    }

    // Resolve Apaczka D2P service outside transaction (external API call)
    let finalServiceId = validatedData.shippingMethodId;
    if (validatedData.apaczkaPointId && validatedData.apaczkaPointSupplier) {
      try {
        const Apaczka = (await import("@/lib/apaczka")).default;
        const correctServiceId = await Apaczka.findD2PService(
          validatedData.apaczkaPointSupplier,
          validatedData.apaczkaPointId
        );
        if (correctServiceId) {
          console.log(
            `Resolved D2P service for ${validatedData.apaczkaPointSupplier} point ${validatedData.apaczkaPointId}: ${finalServiceId} -> ${correctServiceId}`
          );
          finalServiceId = String(correctServiceId);
        }
      } catch (e) {
        console.warn("Failed to resolve D2P service_id during order creation:", e);
      }
    }

    // Atomic transaction: address + order + orderItems + payment
    let orderId: string;
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Find or create address
        const existingAddress = await tx.address.findFirst({
          where: {
            userId: verifiedUserId,
            street: validatedData.street,
            city: validatedData.city,
            postalCode: validatedData.postalCode,
          },
        });

        const address = existingAddress
          ? await tx.address.update({
              where: { id: existingAddress.id },
              data: { phoneNumber: normalizedPhone, country: validatedData.country },
            })
          : await tx.address.create({
              data: {
                userId: verifiedUserId,
                street: validatedData.street,
                city: validatedData.city,
                postalCode: validatedData.postalCode,
                country: validatedData.country,
                phoneNumber: normalizedPhone,
                isDefault: true,
                addressType: "BOTH",
              },
            });

        // 2. Create order with nested orderItems
        const order = await tx.order.create({
          data: {
            userId: verifiedUserId,
            status: "PENDING",
            paymentMethod: validatedData.paymentMethod,
            pricePaidInCents: totalPriceInCents,
            subtotalInCents: subtotalInCents,
            shippingCostInCents: shippingCostInCents,
            billingAddressId: address.id,
            shippingAddressId: address.id,
            shippingServiceId: finalServiceId,
            apaczkaPointId: validatedData.apaczkaPointId?.trim() || undefined,
            apaczkaPointSupplier: validatedData.apaczkaPointSupplier
              ? validatedData.apaczkaPointSupplier.trim().toUpperCase()
              : undefined,
            orderItems: {
              create: validatedData.cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                pricePerItemInCents: productMap.get(item.id)!.priceInCents,
              })),
            },
          },
          include: { orderItems: true },
        });

        // 3. Create payment record
        await tx.payment.create({
          data: {
            orderId: order.id,
            userId: verifiedUserId,
            amount: totalPriceInCents,
            currency: "PLN",
            status: "PENDING",
            paymentMethodType: validatedData.paymentMethod,
          },
        });

        return order;
      });

      orderId = result.id;
      console.log("Created order (atomic):", orderId);
    } catch (error) {
      console.error("Failed to create order:", error);
      return { success: false, error: "Nie udało się utworzyć zamówienia" };
    }

    revalidatePath("/");
    console.log("Order process completed successfully");

    // Send order confirmation email if SMTP configured
    try {
      const user = await prisma.user.findUnique({ where: { id: verifiedUserId } });
      if (user?.email) {
        const siteUrl =
          process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
        const orderUrl = `${siteUrl.replace(/\/$/, "")}/kasa/zlozone-zamowienie?orderId=${orderId}&payment=${validatedData.paymentMethod}`;

        const paymentLabel = validatedData.paymentMethod === "COD" ? "Pobranie" : "Online";

        const html = `
          <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
            <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border-radius:8px;">
              <div style="text-align:center;margin-bottom:18px;">
                <img src="cid:logo.png" alt="Logo" style="height:56px;object-fit:contain;" onerror="this.style.display='none'" />
              </div>
              <h1 style="font-size:20px;margin:0 0 8px;color:#0f172a;text-align:center;">Dziękujemy za zamówienie!</h1>
              <p style="margin:0 0 18px;text-align:center;color:#6b7280;">Twoje zamówienie <strong style="font-family:monospace">${orderId}</strong> zostało przyjęte. Wkrótce je przygotujemy i wyślemy.</p>

              <div style="background:#f8fafc;padding:12px;border-radius:6px;margin-bottom:18px;">
                <strong>Szczegóły zamówienia</strong>
                <div style="margin-top:8px;font-size:14px;color:#374151;">
                  <div>Kwota: <strong>${(totalPriceInCents / 100).toFixed(2)} PLN</strong></div>
                  <div>Płatność: <strong>${paymentLabel}</strong></div>
                </div>
              </div>

              <div style="text-align:center;margin-bottom:18px;">
                <a href="${orderUrl}" style="display:inline-block;background:#111827;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;">Zobacz zamówienie</a>
              </div>

              <p style="color:#6b7280;font-size:13px;margin:0;">Jeśli masz pytania, odpisz na tę wiadomość lub odwiedź naszą stronę.</p>

              <div style="margin-top:18px;color:#9ca3af;font-size:12px;text-align:center;">Pozdrawiamy,<br/>Zespół</div>
            </div>
          </div>
        `;

        // Try to attach logo from public folder if present
        const attachments: any[] = [];
        try {
          // runtime check: include a cid attachment pointing to /public/logo.png
          const logoPath = process.cwd() + "/public/logo.png";
          // eslint-disable-next-line no-eval
          const fs: any = eval("require")("fs");
          if (fs.existsSync(logoPath)) {
            attachments.push({ filename: "logo.png", path: logoPath, cid: "logo.png" });
          }
        } catch (e) {
          // ignore attachment failures
        }

        await mailer.sendMail({
          to: user.email,
          subject: `Potwierdzenie zamówienia ${orderId}`,
          html,
          attachments: attachments.length ? attachments : undefined,
        });
      }
    } catch (e) {
      console.error("Failed to send order confirmation email", e);
    }

    return { success: true, orderId };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Nie udało się utworzyć zamówienia" };
  }
}
