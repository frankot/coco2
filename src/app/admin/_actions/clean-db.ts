"use server";

import prisma from "@/db";
import { deleteImage } from "@/lib/cloudinary";

/**
 * Deletes all products from the database and their associated images from Cloudinary
 */
export async function deleteAllProducts() {
  try {
    // First, get all products to find their Cloudinary IDs
    const products = await prisma.product.findMany({
      select: {
        id: true,
        imagePublicId: true,
      },
    });

    // Count how many products we found
    const totalProducts = products.length;
    if (totalProducts === 0) {
      return {
        success: true,
        message: "Nie znaleziono produktów do usunięcia.",
      };
    }

    // Delete images from Cloudinary
    let cloudinaryDeleteCount = 0;
    let cloudinaryErrors = [];

    for (const product of products) {
      if (product.imagePublicId) {
        try {
          await deleteImage(product.imagePublicId);
          cloudinaryDeleteCount++;
        } catch (error) {
          console.error(`Error deleting Cloudinary image for product ${product.id}:`, error);
          cloudinaryErrors.push(product.id);
        }
      }
    }

    // Delete all products from the database
    const deletedCount = await prisma.product.deleteMany({});

    // Build a detailed success message
    let message = `Usunięto ${deletedCount.count} produktów z bazy danych.`;

    if (cloudinaryDeleteCount > 0) {
      message += ` Usunięto ${cloudinaryDeleteCount} obrazów z Cloudinary.`;
    }

    if (cloudinaryErrors.length > 0) {
      message += ` Nie udało się usunąć ${cloudinaryErrors.length} obrazów z Cloudinary.`;
    }

    return {
      success: true,
      message,
      details: {
        productsDeleted: deletedCount.count,
        imagesDeleted: cloudinaryDeleteCount,
        imageErrors: cloudinaryErrors.length,
      },
    };
  } catch (error) {
    console.error("Error deleting products:", error);
    return {
      success: false,
      message: `Błąd podczas usuwania produktów: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
