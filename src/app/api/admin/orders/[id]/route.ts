import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

// GET request to fetch a specific order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing its properties
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            accountType: true,
          },
        },
        billingAddress: true,
        shippingAddress: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH request to update a specific order
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing its properties
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    const body = await request.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: body.status,
        paymentMethod: body.paymentMethod,
        // Add any other fields you want to update
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE request to delete a specific order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing its properties
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
