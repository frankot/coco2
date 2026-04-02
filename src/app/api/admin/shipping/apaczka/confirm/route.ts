import { createRouteHandler, ApiError, readJson } from "@/lib/api";
import { confirmOrderInApaczka } from "@/lib/apaczka-confirm";

type Body = { orderId: string };

export const POST = createRouteHandler(
  async ({ req }) => {
    const { orderId } = await readJson<Body>(req);
    if (!orderId) throw new ApiError("Missing orderId", 400);

    try {
      return await confirmOrderInApaczka(orderId);
    } catch (e: any) {
      throw new ApiError(e.message || "Nieznany błąd Apaczka", 500);
    }
  },
  { auth: "admin" }
);
