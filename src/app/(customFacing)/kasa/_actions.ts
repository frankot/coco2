"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrUpdateUser } from "@/lib/auth-utils";

const prisma = new PrismaClient();

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
  paymentMethod: z.enum(["BANK_TRANSFER", "STRIPE"]),
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
    const shippingCostInCents = 0; // Free shipping
    const taxInCents = Math.round(subtotalInCents * 0.23); // 23% VAT
    const totalPriceInCents = subtotalInCents + shippingCostInCents + taxInCents;

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
        phoneNumber: validatedData.phoneNumber,
      });

      const userResult = await createOrUpdateUser({
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
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
      address = await prisma.address.create({
        data: {
          userId: verifiedUserId,
          street: validatedData.street,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
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
      order = await prisma.order.create({
        data: {
          userId: verifiedUserId,
          status: "PENDING",
          paymentMethod: validatedData.paymentMethod,
          pricePaidInCents: totalPriceInCents,
          subtotalInCents: subtotalInCents,
          taxInCents: taxInCents,
          shippingCostInCents: shippingCostInCents,
          billingAddressId: address.id,
          shippingAddressId: address.id,
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

    // Create a payment record
    try {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          userId: verifiedUserId,
          amount: totalPriceInCents,
          currency: "PLN",
          status: "PENDING",
          paymentMethodType: validatedData.paymentMethod,
        },
      });
      console.log("Created payment record for order:", order.id);
    } catch (error) {
      console.error("Failed to create payment:", error);
      // If payment creation fails, we should still return the order, but log the error
    }

    revalidatePath("/");
    console.log("Order process completed successfully");

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Nie udało się utworzyć zamówienia" };
  }
}
