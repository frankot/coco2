import { PrismaClient } from "../src/app/generated/prisma";

const prisma = new PrismaClient();

async function deleteAllProducts() {
  try {
    const deletedCount = await prisma.product.deleteMany({});
    console.log(`Deleted ${deletedCount.count} products successfully`);
  } catch (error) {
    console.error("Error deleting products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllProducts();
