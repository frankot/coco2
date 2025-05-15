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

    const clients = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        accountType: true,
        createdAt: true,
        orders: {
          select: {
            pricePaidInCents: true,
          },
        },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ message: "An error occurred fetching clients" }, { status: 500 });
  }
}
