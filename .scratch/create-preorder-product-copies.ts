import { PrismaClient } from "../src/app/generated/prisma/client";
import { slugify } from "../src/lib/formatter";

const SOURCE_NAMES = ["Dr. Coco 1L", "Dr. Coco 280ml", "Dr. Coco 330ml"];

async function uniqueSlug(prisma: any, base: string) {
  let slug = base;
  let suffix = 2;

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function main() {
  const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

  for (const sourceName of SOURCE_NAMES) {
    const source = await prisma.product.findFirst({
      where: { name: sourceName },
    });

    if (!source) {
      console.log(`SKIP missing source: ${sourceName}`);
      continue;
    }

    const targetName = `${source.name} PREORDER`;
    const existing = await prisma.product.findFirst({ where: { name: targetName } });

    if (existing) {
      console.log(`SKIP already exists: ${targetName}`);
      continue;
    }

    const slug = await uniqueSlug(prisma, slugify(targetName));

    const created = await prisma.product.create({
      data: {
        name: targetName,
        slug,
        price: source.price,
        priceInCents: source.priceInCents,
        imagePaths: source.imagePaths,
        description: source.description,
        content: source.content,
        composition: source.composition ?? undefined,
        isAvailable: false,
        isVisible: false,
        isPreorder: false,
        preorderAvailableAt: null,
        preorderOriginalPriceInCents: null,
        promo: source.promo,
        lastPriceInCents: source.lastPriceInCents,
        visibleToDetal: source.visibleToDetal,
        visibleToDetalB2B: source.visibleToDetalB2B,
        visibleToHurt: source.visibleToHurt,
        itemsPerPack: source.itemsPerPack,
        weightKg: source.weightKg,
        lengthCm: source.lengthCm,
        widthCm: source.widthCm,
        heightCm: source.heightCm,
        imagePublicIds: source.imagePublicIds,
      },
      select: { id: true, name: true, slug: true },
    });

    console.log(`CREATED ${created.name} id=${created.id} slug=${created.slug}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
