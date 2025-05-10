import { PrismaClient } from "../src/app/generated/prisma";
import { deleteImage } from "../src/lib/cloudinary";

const prisma = new PrismaClient();

async function deleteAllProductsAndImages() {
  try {
    // First, get all products to find their Cloudinary IDs
    const products = await prisma.product.findMany({
      select: {
        id: true,
        imagePublicId: true,
      },
    });

    console.log(`Found ${products.length} products to delete`);

    // Delete images from Cloudinary
    let cloudinaryDeleteCount = 0;
    for (const product of products) {
      if (product.imagePublicId) {
        try {
          await deleteImage(product.imagePublicId);
          cloudinaryDeleteCount++;
        } catch (error) {
          console.error(
            `Error deleting Cloudinary image for product ${product.id}:`,
            error
          );
        }
      }
    }

    // Delete all products from the database
    const deletedCount = await prisma.product.deleteMany({});

    console.log(`Deleted ${deletedCount.count} products from database`);
    console.log(`Deleted ${cloudinaryDeleteCount} images from Cloudinary`);
  } catch (error) {
    console.error("Error deleting products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllProductsAndImages();
