import { createRouteHandler } from "@/lib/api";
import { syncApaczkaStatuses } from "@/lib/apaczka-sync";

export const POST = createRouteHandler(
  async () => syncApaczkaStatuses(),
  { auth: "admin" }
);
