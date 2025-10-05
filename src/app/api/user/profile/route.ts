import prisma from "@/db";
import { createRouteHandler, ApiError } from "@/lib/api";

export const GET = createRouteHandler(
  async ({ session }) => {
    if (!session?.user?.email) throw new ApiError("Unauthorized", 401);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        accountType: true,
        createdAt: true,
        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            postalCode: true,
            country: true,
            isDefault: true,
            addressType: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!user) throw new ApiError("User not found", 404);
    return user;
  },
  { auth: "user" }
);
