import fs from "fs/promises";
import path from "path";
import prisma from "../src/db";

function toSlug(title: string) {
  let base = title
    .toLowerCase()
    .replace(/[^a-z0-9ąćęłńóśżź\-\s]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);
  if (!base) base = "post";
  return base;
}

async function uniqueSlug(baseSlug: string) {
  const existing = await prisma.blogPost.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });
  let slug = baseSlug;
  if (existing.some((e) => e.slug === baseSlug)) {
    const regex = new RegExp(`^${baseSlug}-(\\d+)$`);
    const nums = existing
      .map((e) => {
        const m = e.slug.match(regex);
        return m ? parseInt(m[1], 10) : null;
      })
      .filter((n) => n != null) as number[];
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 2;
    slug = `${baseSlug}-${next}`;
  }
  return slug;
}

async function seedOne(fileName: string, explicitTitle?: string) {
  const filePath = path.join(process.cwd(), "src", "app", "admin", "blog", "seed", fileName);
  const raw = await fs.readFile(filePath, "utf8");

  // First line is treated as title if explicitTitle not provided
  const [firstLine, ...rest] = raw.split("\n");
  const title = explicitTitle ?? firstLine.trim();
  const content = rest.join("\n").trim();

  const base = toSlug(title);

  // If already exists with exact slug, skip
  const existing = await prisma.blogPost.findUnique({ where: { slug: base } });
  const slug = existing ? await uniqueSlug(base) : base;

  await prisma.blogPost.create({
    data: {
      title,
      content,
      slug,
    },
  });

  console.log(`Seeded: ${title} -> /blog/${slug}`);
}

async function main() {
  try {
    await seedOne("post1.md");
    await seedOne("post2.md");
    // For post3, enforce lowercase title per requirement
    await seedOne("post3.md", "Woda kokosowa – naturalny izotonik");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
