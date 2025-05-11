"use server";

import prisma from "@/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

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

export async function addProduct(prevState: FormState, formData: FormData): Promise<FormState> {
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

    // Convert file to buffer for upload
    const imageBuffer = Buffer.from(await data.image.arrayBuffer());

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadImage(imageBuffer, data.image.name);

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return {
        error: {
          _form: ["Wystąpił błąd podczas przesyłania zdjęcia. Spróbuj ponownie."],
        },
      };
    }

    // Create product in database with Cloudinary URL
    await prisma.product.create({
      data: {
        name: data.name,
        price: data.priceInCents / 100,
        priceInCents: data.priceInCents,
        description: data.description,
        imagePath: cloudinaryResult.secure_url,
        imagePublicId: cloudinaryResult.public_id,
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
  return { success: true };
}

const editSchema = addSchema.extend({
  image: fileSchema.optional(),
});

export async function updateProduct(
  productId: string,
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
        entries.image instanceof File && entries.image.size > 0
          ? {
              name: entries.image.name,
              size: entries.image.size,
              type: entries.image.type,
            }
          : "Empty or not a file",
    });

    // Special handling for empty file input in edit mode
    if (entries.image instanceof File && entries.image.size === 0) {
      delete entries.image;
    }

    const result = editSchema.safeParse(entries);
    if (!result.success) {
      console.error("Validation error:", result.error.flatten().fieldErrors);
      return { error: result.error.flatten().fieldErrors };
    }

    const data = result.data;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: { _form: ["Produkt nie został znaleziony"] } };
    }

    // Prepare update data
    const updateData: any = {
      name: data.name,
      price: data.priceInCents / 100,
      priceInCents: data.priceInCents,
      description: data.description,
    };

    // Handle image update if a new image was provided
    if (data.image instanceof File && data.image.size > 0) {
      // Convert file to buffer for upload
      const imageBuffer = Buffer.from(await data.image.arrayBuffer());

      // Upload image to Cloudinary
      const cloudinaryResult = await uploadImage(imageBuffer, data.image.name);

      if (!cloudinaryResult || !cloudinaryResult.secure_url) {
        return {
          error: {
            _form: ["Wystąpił błąd podczas przesyłania zdjęcia. Spróbuj ponownie."],
          },
        };
      }

      // Delete old image if it exists
      if (product.imagePublicId) {
        await deleteImage(product.imagePublicId);
      }

      // Add new image data to update
      updateData.imagePath = cloudinaryResult.secure_url;
      updateData.imagePublicId = cloudinaryResult.public_id;
    }

    // Update product in database
    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    // Redirect outside try/catch
    redirect("/admin/products");
  } catch (error) {
    // For redirect errors, we need to just rethrow them
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error updating product:", error);
    return {
      error: {
        _form: ["Wystąpił błąd podczas aktualizacji produktu. Spróbuj ponownie."],
      },
    };
  }
  return { success: true };
}

/**
 * Delete a product and its associated image from Cloudinary
 */
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // First get the product to find the image public ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { imagePublicId: true },
    });

    if (!product) {
      return { success: false, message: "Produkt nie został znaleziony" };
    }

    // Delete from Cloudinary if we have a public ID
    if (product.imagePublicId) {
      await deleteImage(product.imagePublicId);
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true, message: "Produkt został usunięty" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Wystąpił błąd podczas usuwania produktu",
    };
  }
}

export async function toggleProductAvailability(productId: string, isAvailable: boolean) {
  await prisma.product.update({
    where: { id: productId },
    data: { isAvailable },
  });
}
