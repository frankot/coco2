"use server";

import prisma from "@/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";

const fileSchema = z
  .instanceof(File, {
    message: "Zdjęcie jest wymagane",
  })
  .refine((file) => file.size > 0, {
    message: "Zdjęcie jest wymagane",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Plik musi być obrazem",
  });

const addSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  priceInCents: z.coerce
    .number()
    .int("Cena musi być liczbą całkowitą")
    .min(1, "Cena musi być większa niż 0"),
  description: z.string().min(1, "Opis jest wymagany"),
  image: fileSchema,
});

// Define error type
type FormState = {
  error?: {
    name?: string[];
    priceInCents?: string[];
    description?: string[];
    image?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function addProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Log what we received for debugging
    const entries = Object.fromEntries(formData);
    console.log("Form data received:", {
      name: entries.name,
      priceInCents: entries.priceInCents,
      description: entries.description,
      // Don't log the whole file for security
      image:
        entries.image instanceof File
          ? {
              name: entries.image.name,
              size: entries.image.size,
              type: entries.image.type,
            }
          : "Not a file",
    });

    const result = addSchema.safeParse(entries);
    if (!result.success) {
      console.error("Validation error:", result.error.flatten().fieldErrors);
      return { error: result.error.flatten().fieldErrors };
    }

    const data = result.data;

    // Validate the file again explicitly
    if (!(data.image instanceof File) || data.image.size === 0) {
      return { error: { image: ["Zdjęcie jest wymagane"] } };
    }

    // Create directory if it doesn't exist
    await fs.mkdir("public/products", { recursive: true });

    // Generate unique image path
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;

    // Save image file
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );

    // Create product in database
    await prisma.product.create({
      data: {
        name: data.name,
        price: data.priceInCents / 100,
        priceInCents: data.priceInCents,
        description: data.description,
        imagePath: imagePath,
        isAvailable: true,
      },
    });

    // Redirect outside try/catch
    redirect("/admin/products");
  } catch (error) {
    // For redirect errors, we need to just rethrow them
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error creating product:", error);
    return {
      error: {
        _form: ["Wystąpił błąd podczas dodawania produktu. Spróbuj ponownie."],
      },
    };
  }

  // This line will never be reached due to the redirect, but TypeScript needs it
  return { success: true };
}
