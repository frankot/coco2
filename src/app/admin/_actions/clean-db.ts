"use server";

import prisma from "@/db";

export async function deleteAllProducts() {
  try {
    const deletedCount = await prisma.product.deleteMany({});
    return {
      success: true,
      message: `Deleted ${deletedCount.count} products successfully`,
    };
  } catch (error) {
    console.error("Error deleting products:", error);
    return {
      success: false,
      message: `Error deleting products: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
