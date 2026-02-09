"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function getDashboardData() {
  await requireAdmin();
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
