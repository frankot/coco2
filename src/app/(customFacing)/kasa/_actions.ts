"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // Verify all cart items have corresponding products
    const existingProductIds = existingProducts.map((p) => p.id);
    const missingProducts = validatedData.cartItems.filter(
      (item) => !existingProductIds.includes(item.id)
    );

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
    }

    // If we still don't have a userId, check if user with this email exists
    if (!userId) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create a new user only if none exists
        try {
          const newUser = await prisma.user.create({
            data: {
              email: validatedData.email,
              password: "hashedpassword", // In a real app, this should be properly hashed
              firstName: validatedData.firstName,
              lastName: validatedData.lastName,
              phoneNumber: validatedData.phoneNumber,
              accountType: "DETAL",
            },
          });
          userId = newUser.id;
        } catch (error) {
          console.error("Failed to create user:", error);
          return { success: false, error: "Nie udało się utworzyć konta użytkownika" };
        }
      }
    }

    // Verify the user exists before proceeding
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return { success: false, error: "Nie znaleziono użytkownika. Zaloguj się lub utwórz konto." };
    }

    // Create the address with verified userId
    let address;
    try {
      address = await prisma.address.create({
        data: {
          userId,
          street: validatedData.street,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
          isDefault: true,
          addressType: "BOTH",
        },
      });
    } catch (error) {
      console.error("Failed to create address:", error);
      return { success: false, error: "Nie udało się utworzyć adresu" };
    }

    // Create the order
    let order;
    try {
      order = await prisma.order.create({
        data: {
          userId,
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
    } catch (error) {
      console.error("Failed to create order:", error);
      return { success: false, error: "Nie udało się utworzyć zamówienia" };
    }

    // Create a payment record
    try {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          userId,
          amount: totalPriceInCents,
          currency: "PLN",
          status: "PENDING",
          paymentMethodType: validatedData.paymentMethod,
        },
      });
    } catch (error) {
      console.error("Failed to create payment:", error);
      // If payment creation fails, we should still return the order, but log the error
    }

    revalidatePath("/");

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Nie udało się utworzyć zamówienia" };
  }
}
