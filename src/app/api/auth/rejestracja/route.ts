import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { registerUser } from "@/lib/auth-utils";

export const POST = createRouteHandler(async ({ req }) => {
  const body = await readJson(req);
  const { email, password, firstName, lastName } = body;
  const result = await registerUser({ email, password, firstName, lastName });
  if (!result.success) throw new ApiError(result.message, 400);
  return { message: result.message, userId: result.userId };
});
