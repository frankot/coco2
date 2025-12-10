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
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Rozmiar zdjęcia przekracza dopuszczalne 2MB",
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
  newImages: z.array(fileSchema).optional(),
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
    // Extract and validate basic data
    const name = formData.get("name") as string;
    const priceInCents = parseInt(formData.get("priceInCents") as string);
    const description = formData.get("description") as string;

    // Get all new image files
    const newImages = formData.getAll("newImages") as File[];

    // Validate required fields
    if (!name || !priceInCents || !description) {
      return { error: { _form: ["Wszystkie pola są wymagane"] } };
    }

    // Validate image sizes before processing
    for (const file of newImages) {
      if (file instanceof File && file.size > 2 * 1024 * 1024) {
        return { error: { image: ["Rozmiar zdjęcia przekracza dopuszczalne 2MB"] } };
      }
    }

    if (
      newImages.length === 0 ||
      newImages.some((file) => !(file instanceof File) || file.size === 0)
    ) {
      return { error: { image: ["Musisz dodać przynajmniej jedno zdjęcie"] } };
    }

    // Upload all images to Cloudinary
    const uploadPromises = newImages.map(async (file) => {
      const imageBuffer = Buffer.from(await file.arrayBuffer());
      return uploadImage(imageBuffer, file.name);
    });

    const cloudinaryResults = await Promise.all(uploadPromises);

    // Check if all uploads were successful
    if (cloudinaryResults.some((result) => !result || !result.secure_url)) {
      return {
        error: {
          _form: ["Wystąpił błąd podczas przesyłania zdjęć. Spróbuj ponownie."],
        },
      };
    }

    // Extract URLs and public IDs
    const imagePaths = cloudinaryResults.map((result) => result!.secure_url);
    const imagePublicIds = cloudinaryResults.map((result) => result!.public_id);

    // Create product in database with Cloudinary URLs
    await prisma.product.create({
      data: {
        name,
        price: priceInCents / 100,
        priceInCents,
        description,
        imagePaths,
        imagePublicIds,
        isAvailable: true,
      },
    });

    // Redirect outside try/catch with correct path
    redirect("/admin/produkty");
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

const editSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  priceInCents: z.coerce
    .number()
    .int("Cena musi być liczbą całkowitą")
    .min(1, "Cena musi być większa niż 0"),
  description: z.string().min(1, "Opis jest wymagany"),
  newImages: z.array(fileSchema).optional(),
  existingImages: z.array(z.string()).optional(),
});

export async function updateProduct(
  productId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract data from FormData
    const name = formData.get("name") as string;
    const priceInCents = parseInt(formData.get("priceInCents") as string);
    const description = formData.get("description") as string;
    const newImages = formData.getAll("newImages") as File[];
    const existingImages = formData.getAll("existingImages") as string[];

    // Validate required fields
    if (!name || !priceInCents || !description) {
      return { error: { _form: ["Wszystkie pola są wymagane"] } };
    }

    // Validate image sizes before processing
    for (const file of newImages) {
      if (file instanceof File && file.size > 2 * 1024 * 1024) {
        return { error: { image: ["Rozmiar zdjęcia przekracza dopuszczalne 2MB"] } };
      }
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: { _form: ["Produkt nie został znaleziony"] } };
    }

    // Prepare update data
    const updateData: any = {
      name,
      price: priceInCents / 100,
      priceInCents,
      description,
    };

    // Handle images
    const finalImagePaths: string[] = [...existingImages];
    const finalImagePublicIds: string[] = [];

    // Add existing image public IDs for images we're keeping
    for (let i = 0; i < existingImages.length; i++) {
      const existingIndex = product.imagePaths.indexOf(existingImages[i]);
      if (existingIndex !== -1 && existingIndex < product.imagePublicIds.length) {
        finalImagePublicIds.push(product.imagePublicIds[existingIndex]);
      }
    }

    // Upload new images if any
    if (newImages.length > 0 && newImages.some((file) => file instanceof File && file.size > 0)) {
      const validNewImages = newImages.filter((file) => file instanceof File && file.size > 0);

      const uploadPromises = validNewImages.map(async (file) => {
        const imageBuffer = Buffer.from(await file.arrayBuffer());
        return uploadImage(imageBuffer, file.name);
      });

      const cloudinaryResults = await Promise.all(uploadPromises);

      // Check if all uploads were successful
      if (cloudinaryResults.some((result) => !result || !result.secure_url)) {
        return {
          error: {
            _form: ["Wystąpił błąd podczas przesyłania nowych zdjęć. Spróbuj ponownie."],
          },
        };
      }

      // Add new images to the arrays
      cloudinaryResults.forEach((result) => {
        if (result) {
          finalImagePaths.push(result.secure_url);
          finalImagePublicIds.push(result.public_id);
        }
      });
    }

    // Delete old images that are no longer used
    const imagesToDelete = product.imagePublicIds.filter(
      (_, index) => !existingImages.includes(product.imagePaths[index])
    );

    for (const publicId of imagesToDelete) {
      if (publicId) {
        await deleteImage(publicId);
      }
    }

    // Ensure we have at least one image
    if (finalImagePaths.length === 0) {
      return { error: { image: ["Produkt musi mieć przynajmniej jedno zdjęcie"] } };
    }

    // Update product in database
    updateData.imagePaths = finalImagePaths;
    updateData.imagePublicIds = finalImagePublicIds;

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    // Redirect outside try/catch with correct path
    redirect("/admin/produkty");
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
 * Delete a product and its associated images from Cloudinary
 */
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // First get the product to find the image public IDs
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { imagePublicIds: true },
    });

    if (!product) {
      return { success: false, message: "Produkt nie został znaleziony" };
    }

    // Delete all images from Cloudinary if we have public IDs
    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      await Promise.all(
        product.imagePublicIds.map((publicId) =>
          publicId ? deleteImage(publicId) : Promise.resolve()
        )
      );
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
