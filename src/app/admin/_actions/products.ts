"use server";

import prisma from "@/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/formatter";
import { sendMail } from "@/lib/mailer";
import { getOrigin } from "@/lib/get-origin";

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
    slug?: string[];
    priceInCents?: string[];
    description?: string[];
    content?: string[];
    itemsPerPack?: string[];
    image?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function addProduct(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();

    // Extract and validate basic data
    const name = formData.get("name") as string;
    const slug = ((formData.get("slug") as string) || "").trim() || slugify(name || "");
    const priceInCents = parseInt(formData.get("priceInCents") as string);
    const lastPriceRaw = formData.get("lastPriceInCents") as string;
    const lastPriceInCents = lastPriceRaw ? parseInt(lastPriceRaw) : null;
    const description = formData.get("description") as string;
    const itemsPerPack = parseInt(formData.get("itemsPerPack") as string) || 12;
    const isVisible = formData.get("isVisible") === "on";
    const isPreorder = formData.get("isPreorder") === "on";
    let isAvailable = formData.get("isAvailable") === "on";
    const preorderAvailableAtRaw = (formData.get("preorderAvailableAt") as string) || "";
    const preorderAvailableAt = preorderAvailableAtRaw ? new Date(preorderAvailableAtRaw) : null;
    const preorderOriginalPriceRaw = formData.get("preorderOriginalPriceInCents") as string;
    const preorderOriginalPriceInCents = preorderOriginalPriceRaw
      ? parseInt(preorderOriginalPriceRaw)
      : null;

    if (isPreorder) {
      isAvailable = false;
    }

    // Package dimensions
    const weightKg = parseFloat(formData.get("weightKg") as string) || 0.5;
    const lengthCm = parseInt(formData.get("lengthCm") as string) || 20;
    const widthCm = parseInt(formData.get("widthCm") as string) || 15;
    const heightCm = parseInt(formData.get("heightCm") as string) || 10;

    // Get all new image files
    const newImages = formData.getAll("newImages") as File[];

    // Validate required fields
    if (!name || !priceInCents || !description || !itemsPerPack || itemsPerPack < 1) {
      return { error: { _form: ["Wszystkie pola są wymagane"] } };
    }

    if (!slug) {
      return { error: { slug: ["Slug jest wymagany"] } };
    }

    if (isPreorder) {
      if (!preorderAvailableAt || Number.isNaN(preorderAvailableAt.getTime())) {
        return { error: { _form: ["Data i godzina preorderu są wymagane"] } };
      }
      if (preorderAvailableAt <= new Date()) {
        return { error: { _form: ["Data preorderu musi być w przyszłości"] } };
      }
      if (!preorderOriginalPriceInCents || preorderOriginalPriceInCents <= priceInCents) {
        return { error: { _form: ["Cena regularna preorderu musi być większa od ceny sprzedaży"] } };
      }
    }

    // Check slug uniqueness
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return { error: { slug: ["Ten slug jest już zajęty"] } };
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

    // Extract content and composition
    const content = (formData.get("content") as string) || "";
    const compositionStr = (formData.get("composition") as string) || "{}";
    let composition: any = {};
    try {
      composition = JSON.parse(compositionStr);
    } catch (e) {
      composition = {};
    }

    // Create product in database with Cloudinary URLs
    await prisma.product.create({
      data: {
        name,
        slug,
        price: priceInCents / 100,
        priceInCents,
        lastPriceInCents,
        description,
        content,
        composition,
        imagePaths,
        imagePublicIds,
        isAvailable,
        isVisible,
        isPreorder,
        preorderAvailableAt: isPreorder ? preorderAvailableAt : null,
        preorderOriginalPriceInCents: isPreorder ? preorderOriginalPriceInCents : null,
        visibleToDetal: formData.get("visibleToDetal") === "on",
        visibleToDetalB2B: formData.get("visibleToDetalB2B") === "on",
        visibleToHurt: formData.get("visibleToHurt") === "on",
        promo: formData.get("promo") === "on",
        itemsPerPack,
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
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
    await requireAdmin();

    // Extract data from FormData
    const name = formData.get("name") as string;
    const slug = ((formData.get("slug") as string) || "").trim() || slugify(name || "");
    const priceInCents = parseInt(formData.get("priceInCents") as string);
    const lastPriceRaw = formData.get("lastPriceInCents") as string;
    const lastPriceInCents = lastPriceRaw ? parseInt(lastPriceRaw) : null;
    const description = formData.get("description") as string;
    const itemsPerPack = parseInt(formData.get("itemsPerPack") as string) || 12;
    const isVisible = formData.get("isVisible") === "on";
    const isPreorder = formData.get("isPreorder") === "on";
    let isAvailable = formData.get("isAvailable") === "on";
    const preorderAvailableAtRaw = (formData.get("preorderAvailableAt") as string) || "";
    const preorderAvailableAt = preorderAvailableAtRaw ? new Date(preorderAvailableAtRaw) : null;
    const preorderOriginalPriceRaw = formData.get("preorderOriginalPriceInCents") as string;
    const preorderOriginalPriceInCents = preorderOriginalPriceRaw
      ? parseInt(preorderOriginalPriceRaw)
      : null;

    if (isPreorder) {
      isAvailable = false;
    }

    const weightKg = parseFloat(formData.get("weightKg") as string) || 0.5;
    const lengthCm = parseInt(formData.get("lengthCm") as string) || 20;
    const widthCm = parseInt(formData.get("widthCm") as string) || 15;
    const heightCm = parseInt(formData.get("heightCm") as string) || 10;
    const newImages = formData.getAll("newImages") as File[];
    const existingImages = formData.getAll("existingImages") as string[];

    // Validate required fields
    if (!name || !priceInCents || !description || !itemsPerPack || itemsPerPack < 1) {
      return { error: { _form: ["Wszystkie pola są wymagane"] } };
    }

    if (!slug) {
      return { error: { slug: ["Slug jest wymagany"] } };
    }

    // Check slug uniqueness (exclude current product)
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== productId) {
      return { error: { slug: ["Ten slug jest już zajęty"] } };
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

    if (isPreorder) {
      if (!preorderAvailableAt || Number.isNaN(preorderAvailableAt.getTime())) {
        return { error: { _form: ["Data i godzina preorderu są wymagane"] } };
      }
      if (!product.isPreorder && preorderAvailableAt <= new Date()) {
        return { error: { _form: ["Data preorderu musi być w przyszłości"] } };
      }
      if (!preorderOriginalPriceInCents || preorderOriginalPriceInCents <= priceInCents) {
        return { error: { _form: ["Cena regularna preorderu musi być większa od ceny sprzedaży"] } };
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      slug,
      price: priceInCents / 100,
      priceInCents,
      lastPriceInCents,
      description,
      itemsPerPack,
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
    };

    // Extract content and composition
    const content = (formData.get("content") as string) || "";
    const compositionStr = (formData.get("composition") as string) || "{}";
    let composition: any = {};
    try {
      composition = JSON.parse(compositionStr);
    } catch (e) {
      composition = {};
    }

    updateData.content = content;
    updateData.composition = composition;
    updateData.isVisible = isVisible;
    updateData.isAvailable = isAvailable;
    updateData.isPreorder = isPreorder;
    updateData.preorderAvailableAt = isPreorder ? preorderAvailableAt : null;
    updateData.preorderOriginalPriceInCents = isPreorder ? preorderOriginalPriceInCents : null;
    updateData.visibleToDetal = formData.get("visibleToDetal") === "on";
    updateData.visibleToDetalB2B = formData.get("visibleToDetalB2B") === "on";
    updateData.visibleToHurt = formData.get("visibleToHurt") === "on";
    updateData.promo = formData.get("promo") === "on";

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

    if (!product.isAvailable && isAvailable) {
      await sendProductAvailabilityNotifications(productId, name, slug);
    }

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
    await requireAdmin();

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

export async function toggleProductVisibility(productId: string, isVisible: boolean) {
  await requireAdmin();
  await prisma.product.update({
    where: { id: productId },
    data: { isVisible },
  });
}

export async function toggleProductGroupVisibility(
  productId: string,
  field: "visibleToDetal" | "visibleToDetalB2B" | "visibleToHurt",
  value: boolean
) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { isPreorder: true },
  });

  if (!product) return;

  if (product.isPreorder) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        visibleToDetal: true,
        visibleToDetalB2B: false,
        visibleToHurt: false,
      },
    });
    return;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { [field]: value },
  });
}

export async function toggleProductAvailability(productId: string, isAvailable: boolean) {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, slug: true, isAvailable: true, isPreorder: true },
  });

  if (!product) return;

  if (product.isPreorder) {
    await prisma.product.update({
      where: { id: productId },
      data: { isAvailable: false },
    });
    return;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isAvailable },
  });

  if (!product.isAvailable && isAvailable) {
    await sendProductAvailabilityNotifications(product.id, product.name, product.slug);
  }
}

async function sendProductAvailabilityNotifications(productId: string, productName: string, slug: string) {
  const notifications = await prisma.productAvailabilityNotification.findMany({
    where: { productId, status: "ACTIVE" },
    select: { id: true, email: true },
  });

  if (notifications.length === 0) return;

  const origin = getOrigin().replace(/\/$/, "");
  const productUrl = `${origin}/sklep/${slug || productId}`;
  const sentIds: string[] = [];

  for (const notification of notifications) {
    const sent = await sendMail({
      to: notification.email,
      subject: `Produkt dostępny: ${productName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.5;color:#111827;">
          <h1 style="font-size:22px;margin:0 0 16px;">Produkt jest już dostępny</h1>
          <p style="margin:0 0 16px;">Produkt <strong>${productName}</strong> wrócił do sprzedaży.</p>
          <a href="${productUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Zobacz produkt</a>
        </div>
      `,
    });

    if (sent) sentIds.push(notification.id);
  }

  if (sentIds.length > 0) {
    await prisma.productAvailabilityNotification.updateMany({
      where: { id: { in: sentIds } },
      data: { status: "SENT", sentAt: new Date() },
    });
  }
}
