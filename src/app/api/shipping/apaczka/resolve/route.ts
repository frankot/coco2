import { createRouteHandler, readJson, ApiError } from "@/lib/api";
import Apaczka from "@/lib/apaczka";

type Body = { supplier: string; code: string; country_code?: string };

export const POST = createRouteHandler(
  async ({ req }) => {
    const { supplier, code, country_code = "PL" } = await readJson<Body>(req);
    if (!supplier || !code) throw new ApiError("supplier and code are required", 400);
    try {
      const res = await Apaczka.resolvePoint(supplier, code, country_code);
      if ((res as any).internalId) return { success: true, resolved: true, ...res };
      return { success: true, resolved: false, tried: (res as any).tried };
    } catch (e: any) {
      throw new ApiError(e?.message || String(e), 500);
    }
  },
  { auth: "admin" }
);

export default POST;
