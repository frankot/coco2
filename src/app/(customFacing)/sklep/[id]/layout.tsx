import prisma from "@/db";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true, description: true },
    });

    if (!product) {
      return {
        title: "Dr.Coco | Produkt",
        description: "Produkt nie został znaleziony.",
      };
    }

    return {
      title: `Dr.Coco | ${product.name}`,
      description: product.description.slice(0, 160) + (product.description.length > 160 ? "..." : ""),
    };
  } catch (error) {
    return {
      title: "Dr.Coco | Produkt",
      description: "Naturalna woda kokosowa Dr.Coco",
    };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
