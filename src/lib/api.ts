import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "@/db";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type AuthMode = "none" | "user" | "admin";

interface HandlerContext<P = any> {
  req: NextRequest;
  params: P;
  session: any; // Augmented session type defined elsewhere
  prisma: typeof prisma;
}

interface HandlerOptions {
  auth?: AuthMode; // default none
}

type HandlerResult = NextResponse | any;

type RouteHandler<P = any> = (ctx: HandlerContext<P>) => Promise<HandlerResult> | HandlerResult;

export function createRouteHandler<P = any>(
  handler: RouteHandler<P>,
  options: HandlerOptions = {}
) {
  const auth: AuthMode = options.auth || "none";
  return async function route(req: NextRequest, context: { params: P }) {
    try {
      let session: any = null;
      if (auth !== "none") {
        session = await getServerSession(authOptions);
        if (!session) return jsonError("Unauthorized", 401);
        if (auth === "admin" && session.user?.role !== "ADMIN") {
          return jsonError("Forbidden", 403);
        }
      }
      // Await params if it's a Promise (for dynamic API routes)
      let params: P = (context?.params as P) || ({} as P);
      if (params && typeof (params as any).then === "function") {
        params = await (params as any);
      }
      const result = await handler({
        req,
        params,
        session,
        prisma,
      });
      if (result instanceof NextResponse) return result;
      return NextResponse.json(result);
    } catch (err: any) {
      if (err instanceof ApiError) {
        return jsonError(err.message, err.status, err.details);
      }
      console.error("[API_UNHANDLED_ERROR]", err);
      return jsonError("Internal server error", 500);
    }
  };
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, ...(details ? { details } : {}) }, { status });
}

export function getRequiredParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string {
  const value = params?.[key];
  if (!value) throw new ApiError(`Missing required param: ${key}`, 400);
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function readJson<T = any>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
}
