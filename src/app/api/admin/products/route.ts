import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/db";

export async function GET() {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" }, // Default ordering by newest first
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
