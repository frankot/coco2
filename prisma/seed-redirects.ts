// SEO redirect mappings — old drcoco.pl (WordPress) → new (Next.js)
// Run: npx tsx --env-file=.env prisma/seed-redirects.ts

import "dotenv/config";
import prisma from "../src/db";

const redirects = [
  // Blog posts — /artykuly/:slug → /blog/:slug
  {
    oldPath: "/artykuly/dr-coco-is-cruelty-free",
    newPath: "/blog/dr-coco-is-cruelty-free",
  },
  {
    oldPath: "/artykuly/popularnosc-wody-kokosowej",
    newPath: "/blog/popularnosc-wody-kokosowej",
  },

  // Products — /produkt/:slug → /sklep/:slug
  {
    oldPath: "/produkt/dr-coco-330-ml",
    newPath: "/sklep/dr-coco-330-ml",
  },
  {
    oldPath: "/produkt/dr-coco-280ml",
    newPath: "/sklep/dr-coco-280ml",
  },

  // WordPress category pages → shop
  {
    oldPath: "/kategoria-produktu/bez-kategorii",
    newPath: "/sklep",
  },

  // Legacy author/tag pages → 410
  { oldPath: "/author", newPath: "/", redirectType: "410" },
  { oldPath: "/tag", newPath: "/", redirectType: "410" },
];

async function main() {
  console.log("Seeding redirect maps...");

  for (const r of redirects) {
    await prisma.redirectMap.upsert({
      where: { oldPath: r.oldPath },
      update: { newPath: r.newPath, redirectType: r.redirectType ?? "301" },
      create: {
        oldPath: r.oldPath,
        newPath: r.newPath,
        redirectType: r.redirectType ?? "301",
      },
    });
  }

  const count = await prisma.redirectMap.count();
  console.log(`Seeded ${count} redirect mappings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
