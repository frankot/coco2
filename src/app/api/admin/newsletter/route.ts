import { NextResponse } from "next/server";
import { createRouteHandler } from "@/lib/api";
import { format } from "date-fns";

export const GET = createRouteHandler(
  async ({ req, prisma }) => {
    const emails = await prisma.newsletterEmail.findMany({
      orderBy: { createdAt: "desc" },
    });

    // CSV export
    const url = new URL(req.url);
    if (url.searchParams.get("format") === "csv") {
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
