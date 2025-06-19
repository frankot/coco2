import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/db";

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        user: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
        pricePaidInCents: true,
        createdAt: true,
        status: true,
        billingAddress: true,
        shippingAddress: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            pricePerItemInCents: true,
            product: {
              select: {
                id: true,
                name: true,
                imagePath: true,
                priceInCents: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[USER_ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
