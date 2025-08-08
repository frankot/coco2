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
      },
    });
    if (!user) throw new ApiError("User not found", 404);
    return user;
  },
  { auth: "user" }
);
