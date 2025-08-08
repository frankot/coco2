import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      select: {
        id: true,
        pricePaidInCents: true,
        createdAt: true,
        status: true,
        user: {
          select: {
            id: true,
            email: true,
            accountType: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            pricePerItemInCents: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "An error occurred fetching orders" }, { status: 500 });
  }
}
