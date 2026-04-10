"use server";

import prisma from "@/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

type FormState = {
  error?: {
    code?: string[];
    discountType?: string[];
    discountAmount?: string[];
    isSingleUse?: string[];
    _form?: string[];
  };
  success?: boolean;
};

const discountCodeSchema = z.object({
  code: z
    .string()
    .min(3, "Kod musi mieć co najmniej 3 znaki")
    .max(20, "Kod może mieć maksymalnie 20 znaków")
    .regex(/^[A-Za-z0-9-]+$/, "Kod może zawierać tylko litery, cyfry i myślniki"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
    errorMap: () => ({ message: "Nieprawidłowy typ rabatu" }),
  }),
  discountAmount: z.coerce.number().positive("Wartość musi być większa od 0"),
  isSingleUse: z.string().optional(),
});

export async function addDiscountCode(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireAdmin();

    const entries = Object.fromEntries(formData);
    const result = discountCodeSchema.safeParse(entries);
    if (!result.success) {
      return { error: result.error.flatten().fieldErrors };
    }

    const data = result.data;
    const normalizedCode = data.code.trim().toUpperCase();

    // Validate percentage values
    if (data.discountType === "PERCENTAGE" && data.discountAmount > 100) {
      return { error: { discountAmount: ["Procent nie może przekraczać 100%"] } };
    }

    // For FIXED_AMOUNT, convert PLN to grosze
    const discountAmount =
      data.discountType === "FIXED_AMOUNT" ? Math.round(data.discountAmount * 100) : data.discountAmount;

    // Check uniqueness
    const existing = await prisma.discountCode.findUnique({
      where: { code: normalizedCode },
    });
    if (existing) {
      return { error: { code: ["Kod rabatowy o tej nazwie już istnieje"] } };
    }

    await prisma.discountCode.create({
      data: {
        code: normalizedCode,
        discountType: data.discountType,
        discountAmount,
        isSingleUse: data.isSingleUse === "on",
      },
    });

    redirect("/admin/rabaty");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Error creating discount code:", error);
    return {
      error: {
        _form: ["Wystąpił błąd podczas tworzenia kodu rabatowego. Spróbuj ponownie."],
      },
    };
  }

  return { success: true };
}

export async function toggleDiscountCode(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();
    await prisma.discountCode.update({
      where: { id },
      data: { isActive },
    });
    return { success: true, message: `Kod rabatowy został ${isActive ? "aktywowany" : "deaktywowany"}` };
  } catch (error) {
    console.error("Error toggling discount code:", error);
    return { success: false, message: "Wystąpił błąd podczas zmiany statusu kodu" };
  }
}

export async function deleteDiscountCode(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();

    const code = await prisma.discountCode.findUnique({
      where: { id },
      select: { usedCount: true },
    });

    if (!code) {
      return { success: false, message: "Kod rabatowy nie został znaleziony" };
    }

    if (code.usedCount > 0) {
      return {
        success: false,
        message: "Nie można usunąć użytego kodu rabatowego. Możesz go deaktywować.",
      };
    }

    await prisma.discountCode.delete({ where: { id } });
    return { success: true, message: "Kod rabatowy został usunięty" };
  } catch (error) {
    console.error("Error deleting discount code:", error);
    return { success: false, message: "Wystąpił błąd podczas usuwania kodu rabatowego" };
  }
}
