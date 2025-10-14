"use server";

import { PrismaClient } from "@/app/generated/prisma";
import Apaczka from "@/lib/apaczka";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrUpdateUser } from "@/lib/auth-utils";

const prisma = new PrismaClient();

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

    // Verify all cart items have corresponding products
    const existingProductIds = existingProducts.map((p) => p.id);
    const missingProducts = validatedData.cartItems.filter(
      (item) => !existingProductIds.includes(item.id)
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

    // Calculate total price
    const subtotalInCents = validatedData.cartItems.reduce(
      (sum, item) => sum + item.priceInCents * item.quantity,
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

    // Create the address with verified userId
    let address;
    try {
      const normalizedPhone = normalizePhonePL(validatedData.phoneNumber);
      if (!normalizedPhone) {
        return {
          success: false,
          error: "Niepoprawny numer telefonu. Podaj 9 cyfr (PL) lub numer z prefiksem +48.",
        };
      }
      address = await prisma.address.create({
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
      console.log("Created address:", address.id);
    } catch (error) {
      console.error("Failed to create address:", error);
      return { success: false, error: "Nie udało się utworzyć adresu" };
    }

    // Create the order
    let order;
    try {
      // If a pickup point code was provided, try to resolve it server-side
      // to an internal Apaczka point id so that confirm can send the
      // correct foreign_address_id. We'll call the new internal resolve
      // endpoint. This is optional: if resolution fails we'll still store
      // the original code and let admin confirm handle errors.
      let resolvedPointId: string | undefined = undefined;
      if (validatedData.apaczkaPointId && validatedData.apaczkaPointSupplier) {
        try {
          const res = await Apaczka.resolvePoint(
            validatedData.apaczkaPointSupplier,
            validatedData.apaczkaPointId,
            "PL"
          );
          if ((res as any)?.internalId) {
            resolvedPointId = (res as any).internalId;
            console.log("Resolved apaczka point at order creation", resolvedPointId);
          } else {
            console.log(
              "Point resolve returned no internal id; will store original code",
              (res as any).tried || res
            );
          }
        } catch (e) {
          console.warn("Point resolve call failed during order creation", String(e));
        }
      }

      order = await prisma.order.create({
        data: {
          userId: verifiedUserId,
          // Create initially as PENDING to avoid runtime enum mismatches with generated Prisma client.
          // We'll try to switch to PAID immediately after creation (in a safe try/catch) when appropriate.
          status: "PENDING",
          paymentMethod: validatedData.paymentMethod,
          pricePaidInCents: totalPriceInCents,
          subtotalInCents: subtotalInCents,
          shippingCostInCents: shippingCostInCents,
          billingAddressId: address.id,
          shippingAddressId: address.id,
          shippingServiceId: validatedData.shippingMethodId,
          // Normalize point id and supplier to avoid accidental whitespace / casing issues
          // Prefer the resolved internal id if available; fall back to map code
          apaczkaPointId: (resolvedPointId || validatedData.apaczkaPointId)?.trim() || undefined,
          apaczkaPointSupplier: validatedData.apaczkaPointSupplier
            ? validatedData.apaczkaPointSupplier.trim().toUpperCase()
            : undefined,
          orderItems: {
            create: validatedData.cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              pricePerItemInCents: item.priceInCents,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });
      console.log("Created order:", order.id);
    } catch (error) {
      console.error("Failed to create order:", error);
      return { success: false, error: "Nie udało się utworzyć zamówienia" };
    }

    const orderId = order.id;

    // If payment method is COD, attempt to mark order as PAID. Do this in a try/catch
    // so we don't fail if the generated Prisma client or DB enum hasn't been updated yet.
    if (validatedData.paymentMethod === "COD") {
      try {
        await prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } });
        // Optional: refresh order (not strictly needed below because we only use orderId)
      } catch (e) {
        console.warn(
          "Could not set order status to PAID (client/schema mismatch). Leaving as PENDING.",
          e
        );
      }
    }

    // Create a payment record
    try {
      await prisma.payment.create({
        data: {
          orderId,
          userId: verifiedUserId,
          amount: totalPriceInCents,
          currency: "PLN",
          // If COD, mark payment as COMPLETED because payment will be collected on delivery
          status: validatedData.paymentMethod === "COD" ? "COMPLETED" : "PENDING",
          paymentMethodType: validatedData.paymentMethod,
        },
      });
      console.log("Created payment record for order:", orderId);
    } catch (error) {
      console.error("Failed to create payment:", error);
      // If payment creation fails, we should still return the order, but log the error
    }

    revalidatePath("/");
    console.log("Order process completed successfully");

    return { success: true, orderId };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Nie udało się utworzyć zamówienia" };
  }
}
