"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrUpdateUser } from "@/lib/auth-utils";
import { sendOrderPlacedEmail } from "@/lib/order-emails";
import { generateAndSendInvoice } from "@/lib/invoice";

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
      quantity: z.number().min(1).max(500, "Maksymalna ilość to 500"),
      imagePath: z.string(),
    })
  ),
  userId: z.string().optional(),
  apaczkaPointId: z.string().optional(),
  apaczkaPointSupplier: z.string().optional(),
  newsletterConsent: z.boolean().optional(),
  discountCode: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export async function createOrder(formData: OrderFormData) {
  try {
    // Validate form data
    const validatedData = orderFormSchema.parse(formData);

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

    // Build a map of DB products for price lookups
    const productMap = new Map(existingProducts.map((p) => [p.id, p]));

    // Verify all cart items have corresponding products
    const missingProducts = validatedData.cartItems.filter((item) => !productMap.has(item.id));

    if (missingProducts.length > 0) {
      return {
        success: false,
        error: `Niektóre produkty nie są dostępne: ${missingProducts.map((p) => p.name).join(", ")}`,
      };
    }

    if (existingProducts.length === 0) {
      return {
        success: false,
        error: "Nie znaleziono żadnych produktów w bazie danych",
      };
    }

    // Resolve custom prices for authenticated user (B2B/HURT)
    const earlySession = await getServerSession(authOptions);
    const earlyUserId = validatedData.userId || earlySession?.user?.id;
    if (earlyUserId) {
      const { getCustomPriceMap } = await import("@/lib/resolve-prices");
      const customPriceMap = await getCustomPriceMap(earlyUserId);
      for (const [productId, product] of productMap) {
        const customPrice = customPriceMap.get(productId);
        if (customPrice !== undefined) {
          productMap.set(productId, { ...product, priceInCents: customPrice });
        }
      }
    }

    // Calculate total price using DB prices — never trust client-provided prices
    const subtotalInCents = validatedData.cartItems.reduce(
      (sum, item) => sum + productMap.get(item.id)!.priceInCents * item.quantity,
      0
    );

    // Compute shipping cost via Apaczka order_valuation
    let shippingCostInCents = 1500; // fallback
    try {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          weightKg: true,
          lengthCm: true,
          widthCm: true,
          heightCm: true,
          priceInCents: true,
        },
      });
      const prodMap = new Map(products.map((p) => [p.id, p]));

      let totalWeight = 0;
      let maxLength = 0;
      let maxWidth = 0;
      let totalHeight = 0;

      for (const item of validatedData.cartItems) {
        const prod = prodMap.get(item.id);
        if (!prod) continue;
        totalWeight += prod.weightKg * item.quantity;
        maxLength = Math.max(maxLength, prod.lengthCm);
        maxWidth = Math.max(maxWidth, prod.widthCm);
        totalHeight += prod.heightCm * item.quantity;
      }
      totalHeight = Math.min(totalHeight, 100);

      const Apaczka = (await import("@/lib/apaczka")).default;
      const order = {
        service_id: Number(validatedData.shippingMethodId) || 0,
        address: {
          sender: {
            country_code: process.env.SENDER_COUNTRY_CODE || "PL",
            name: process.env.SENDER_NAME || "",
            line1: process.env.SENDER_LINE1 || "",
            line2: process.env.SENDER_LINE2 || "",
            postal_code: process.env.SENDER_POSTAL_CODE || "",
            state_code: process.env.SENDER_STATE_CODE || "",
            city: process.env.SENDER_CITY || "",
            is_residential: 0,
            contact_person: process.env.SENDER_CONTACT_PERSON || "",
            email: process.env.SENDER_EMAIL || "",
            phone: process.env.SENDER_PHONE || "",
          },
          receiver: {
            country_code: "PL",
            name: `${validatedData.firstName} ${validatedData.lastName}`,
            line1: validatedData.street,
            line2: "",
            postal_code: validatedData.postalCode,
            state_code: "",
            city: validatedData.city,
            is_residential: 1,
            contact_person: `${validatedData.firstName} ${validatedData.lastName}`,
            email: validatedData.email,
            phone: normalizePhonePL(validatedData.phoneNumber) || "",
          },
        },
        shipment: [
          {
            dimension1: Math.max(maxLength, 1),
            dimension2: Math.max(maxWidth, 1),
            dimension3: Math.max(totalHeight, 1),
            weight: Math.max(Math.round(totalWeight * 10) / 10, 0.1),
            is_nstd: 0,
            shipment_type_code: "PACZKA",
          },
        ],
        shipment_value: subtotalInCents,
        shipment_currency: "PLN",
        pickup: { type: "SELF" },
      };

      const valuation = await Apaczka.orderValuation(order);
      const priceTable = valuation.response?.price_table;
      if (priceTable) {
        const serviceId = String(validatedData.shippingMethodId);
        if (priceTable[serviceId]) {
          const grossStr =
            (priceTable[serviceId] as any).price_gross ??
            (priceTable[serviceId] as any).price ??
            "0";
          shippingCostInCents = Math.round(parseFloat(grossStr));
        } else {
          // If specific service not found, use cheapest available
          const prices = Object.values(priceTable)
            .map((v: any) => Math.round(parseFloat(v.price_gross ?? v.price ?? "0")))
            .filter((p) => p > 0);
          if (prices.length > 0) {
            shippingCostInCents = Math.min(...prices);
          }
        }
      }
    } catch (e) {
      console.error("Apaczka valuation failed, using fallback shipping cost:", e);
    }

    // Validate and apply discount code
    let discountAmountInCents = 0;
    let verifiedDiscountCodeId: string | null = null;
    let verifiedDiscountCodeValue: string | null = null;

    if (validatedData.discountCode) {
      const normalizedCode = validatedData.discountCode.trim().toUpperCase();
      if (normalizedCode.length >= 3) {
        const discount = await prisma.discountCode.findUnique({
          where: { code: normalizedCode },
        });

        if (!discount || !discount.isActive || (discount.isSingleUse && discount.usedCount > 0)) {
          return { success: false, error: "Kod rabatowy jest nieprawidłowy lub wygasł" };
        }

        if (discount.discountType === "PERCENTAGE") {
          discountAmountInCents = Math.floor((subtotalInCents * discount.discountAmount) / 100);
        } else {
          discountAmountInCents = discount.discountAmount;
        }
        discountAmountInCents = Math.min(discountAmountInCents, subtotalInCents);

        verifiedDiscountCodeId = discount.id;
        verifiedDiscountCodeValue = normalizedCode;
      }
    }

    const totalPriceInCents = subtotalInCents - discountAmountInCents + shippingCostInCents;

    // Handle user - first check if a userId was provided or if there's a logged in user
    let userId = validatedData.userId;

    // If no userId was provided, try to get it from the session
    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id;
    }

    // If we still don't have a userId, use createOrUpdateUser function
    if (!userId) {
      const userResult = await createOrUpdateUser({
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });

      if (!userResult.success) {
        return { success: false, error: userResult.message };
      }

      userId = userResult.userId;
    }

    // Verify the user exists before proceeding
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return { success: false, error: "Nie znaleziono użytkownika. Zaloguj się lub utwórz konto." };
    }

    // Now userId is definitely not undefined - if we got here, userId exists and is valid
    const verifiedUserId = userId as string;

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
          finalServiceId = String(correctServiceId);
        }
      } catch (e) {
        // D2P resolution is best-effort; order can proceed with original service ID
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
            status: validatedData.paymentMethod === "COD" ? "PAID" : "PENDING",
            paymentMethod: validatedData.paymentMethod,
            pricePaidInCents: totalPriceInCents,
            subtotalInCents: subtotalInCents,
            shippingCostInCents: shippingCostInCents,
            billingAddressId: address.id,
            shippingAddressId: address.id,
            discountCodeId: verifiedDiscountCodeId || undefined,
            discountCodeValue: verifiedDiscountCodeValue || undefined,
            discountAmountInCents,
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

        // 4. Atomically increment discount code usage
        if (verifiedDiscountCodeId) {
          await tx.discountCode.update({
            where: { id: verifiedDiscountCodeId },
            data: { usedCount: { increment: 1 } },
          });
        }

        return order;
      });

      orderId = result.id;
    } catch (error) {
      console.error("Failed to create order:", error);
      return { success: false, error: "Nie udało się utworzyć zamówienia" };
    }

    revalidatePath("/");

    // Send order confirmation email
    try {
      const orderForEmail = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          orderItems: {
            select: {
              quantity: true,
              pricePerItemInCents: true,
              product: { select: { name: true } },
            },
          },
        },
      });

      if (orderForEmail?.user?.email) {
        await sendOrderPlacedEmail({
          id: orderForEmail.id,
          paymentMethod: orderForEmail.paymentMethod,
          pricePaidInCents: orderForEmail.pricePaidInCents,
          subtotalInCents: orderForEmail.subtotalInCents,
          shippingCostInCents: orderForEmail.shippingCostInCents,
          discountAmountInCents: orderForEmail.discountAmountInCents,
          apaczkaTrackingUrl: orderForEmail.apaczkaTrackingUrl,
          apaczkaWaybillNumber: orderForEmail.apaczkaWaybillNumber,
          shippingServiceName: orderForEmail.shippingServiceName,
          user: orderForEmail.user,
          orderItems: orderForEmail.orderItems,
        });
      }
    } catch (e) {
      console.error("Failed to send order confirmation email", e);
    }

    // Invoice generation for COD (already PAID at creation)
    if (validatedData.paymentMethod === "COD") {
      generateAndSendInvoice(orderId).catch((e) => {
        console.error("[WFIRMA] Invoice generation failed for COD order", orderId, e);
      });
    }

    // Newsletter opt-in
    if (validatedData.newsletterConsent && validatedData.email) {
      try {
        await prisma.newsletterEmail.upsert({
          where: { email: validatedData.email },
          create: { email: validatedData.email },
          update: {},
        });
      } catch (e) {
        console.error("Failed to save newsletter subscription", e);
      }
    }

    return { success: true, orderId };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Nie udało się utworzyć zamówienia" };
  }
}
