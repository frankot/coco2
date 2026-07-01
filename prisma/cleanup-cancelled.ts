// Side-effect import: load .env before anything else
import "dotenv/config";

// Dynamic import so env is loaded before DB module initializes
async function main() {
  const { default: prisma } = await import("@/db");

  const user = await prisma.user.findUnique({
    where: { email: "frankiantki@gmail.com" },
    select: { id: true },
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  const cancelled = await prisma.order.findMany({
    where: { status: "CANCELLED", userId: user.id },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  
  console.log(`Found ${cancelled.length} cancelled orders:`);
  for (const o of cancelled) {
    console.log(`  ${o.id} — ${o.createdAt.toISOString()}`);
  }

  if (cancelled.length === 0) {
    console.log("Nothing to delete.");
    return;
  }

  const result = await prisma.order.deleteMany({
    where: { status: "CANCELLED", userId: user.id },
  });

  console.log(`\nDeleted ${result.count} orders.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
