import prisma from "@/db";

/**
 * Utility function to update all existing users to have DETAL account type
 * This can be called from a server action or API route if needed
 */
export async function updateAllUsersAccountType() {
  try {
    // Get all users that might not have account type set
    const usersToUpdate = await prisma.user.findMany({
      where: {
        NOT: [{ accountType: "ADMIN" }, { accountType: "DETAL" }, { accountType: "HURT" }],
      },
      select: {
        id: true,
      },
    });

    if (usersToUpdate.length === 0) {
      return { success: true, message: "No users need updating" };
    }

    // Update all users with null accountType to DETAL
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: usersToUpdate.map((user) => user.id),
        },
      },
      data: {
        accountType: "DETAL",
      },
    });

    return {
      success: true,
      message: `${result.count} users updated successfully`,
    };
  } catch (error) {
    console.error("Error updating users:", error);
    return {
      success: false,
      message: "Error updating users",
      error,
    };
  }
}
