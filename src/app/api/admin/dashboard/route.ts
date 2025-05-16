import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

export async function GET() {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Prisma client
    const prisma = new PrismaClient();

    try {
      // Fetch stats
      const productsCount = await prisma.product.count();
      const usersCount = await prisma.user.count();

      return NextResponse.json({ productsCount, usersCount }, { status: 200 });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Error in dashboard API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
