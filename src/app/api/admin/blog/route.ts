import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";

export const GET = createRouteHandler(
  async () => {
    const posts = await prisma.blogPost.findMany({
      select: { id: true, title: true, slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  },
  { auth: "admin" }
);
