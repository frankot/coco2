"use server";

import prisma from "@/db";
import { requireAdmin } from "@/lib/require-admin";

export async function getDashboardData() {
  await requireAdmin();

  try {
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    return { productsCount, usersCount };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { productsCount: 0, usersCount: 0 };
  }
}
