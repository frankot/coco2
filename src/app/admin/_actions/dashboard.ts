"use server";

import { PrismaClient } from "@/app/generated/prisma";

export async function getDashboardData() {
  const prisma = new PrismaClient();

  try {
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    return { productsCount, usersCount };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { productsCount: 0, usersCount: 0 };
  } finally {
    await prisma.$disconnect();
  }
} 