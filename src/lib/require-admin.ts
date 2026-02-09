import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Ensures the current user has an admin session.
 * Throws an error if not authenticated or not an admin.
 * Use at the top of every admin-only server action.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}
