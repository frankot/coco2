import { NextResponse } from "next/server";
import prisma from "@/db";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}
