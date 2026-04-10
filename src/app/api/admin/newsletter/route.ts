import { NextResponse } from "next/server";
import { createRouteHandler } from "@/lib/api";
import { format } from "date-fns";

export const GET = createRouteHandler(
  async ({ req, prisma }) => {
    const url = new URL(req.url);
    const formatParam = url.searchParams.get("format");
    const limitParam = url.searchParams.get("limit");
    const parsedLimit = limitParam ? Number(limitParam) : undefined;
    const take =
      formatParam === "csv" || !Number.isFinite(parsedLimit) || (parsedLimit ?? 0) <= 0
        ? undefined
        : parsedLimit;

    const emails = await prisma.newsletterEmail.findMany({
      orderBy: { createdAt: "desc" },
      ...(take ? { take } : {}),
    });

    // CSV export
    if (formatParam === "csv") {
      const header = "email;data_dolaczenia";
      const rows = emails.map(
        (e) => `${e.email};${format(new Date(e.createdAt), "yyyy-MM-dd HH:mm")}`
      );
      const csv = "\uFEFF" + [header, ...rows].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="newsletter_${format(new Date(), "yyyy-MM-dd")}.csv"`,
        },
      });
    }

    return emails;
  },
  { auth: "admin" }
);
