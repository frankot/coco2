"use server";

import prisma from "@/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

// Define error type
type FormState = {
  error?: {
    email?: string[];
    firstName?: string[];
    lastName?: string[];
    phoneNumber?: string[];
    password?: string[];
    confirmPassword?: string[];
    accountType?: string[];
    _form?: string[];
  };
  success?: boolean;
};

const clientSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  confirmPassword: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  accountType: z.enum(["ADMIN", "DETAL", "HURT"], {
    errorMap: () => ({ message: "Nieprawidłowy typ konta" }),
  }),
});

// Edit schema with optional password
const editClientSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków").optional().or(z.literal("")),
  confirmPassword: z
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .optional()
    .or(z.literal("")),
  accountType: z.enum(["ADMIN", "DETAL", "HURT"], {
    errorMap: () => ({ message: "Nieprawidłowy typ konta" }),
  }),
});

// Password confirmation custom validator
const validatePasswords = (data: any): FormState | null => {
  // If no password or empty password, skip validation (for edit form)
  if (!data.password || data.password === "") return null;

  if (data.password !== data.confirmPassword) {
    return {
      error: {
        confirmPassword: ["Hasła nie są identyczne"],
      },
    };
  }
  return null;
};

export async function addClient(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const entries = Object.fromEntries(formData);

    // Validation
    const result = clientSchema.safeParse(entries);
    if (!result.success) {
      return { error: result.error.flatten().fieldErrors };
    }

    const data = result.data;

    // Check passwords match
    const passwordError = validatePasswords(data);
    if (passwordError) return passwordError;

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: { email: ["Ten adres email jest już zajęty"] } };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
        password: hashedPassword,
        accountType: data.accountType,
      },
    });

    // Redirect
    redirect("/admin/klienci");
  } catch (error) {
    // For redirect errors, rethrow them
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error creating client:", error);
    return {
      error: {
        _form: ["Wystąpił błąd podczas dodawania klienta. Spróbuj ponownie."],
      },
    };
  }

  return { success: true };
}

export async function updateClient(
  clientId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const entries = Object.fromEntries(formData);

    // Validation
    const result = editClientSchema.safeParse(entries);
    if (!result.success) {
      return { error: result.error.flatten().fieldErrors };
    }

    const data = result.data;

    // Check if client exists
    const existingClient = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      return { error: { _form: ["Klient nie został znaleziony"] } };
    }

    // Check if the email is taken by someone else
    if (data.email !== existingClient.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailTaken) {
        return { error: { email: ["Ten adres email jest już zajęty"] } };
      }
    }

    // Check passwords match if provided
    const passwordError = validatePasswords(data);
    if (passwordError) return passwordError;

    // Prepare update data
    const updateData: any = {
      email: data.email,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      phoneNumber: data.phoneNumber || null,
      accountType: data.accountType,
    };

    // Update password if provided
    if (data.password && data.password !== "") {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateData.password = hashedPassword;
    }

    // Update user
    await prisma.user.update({
      where: { id: clientId },
      data: updateData,
    });

    // Redirect
    redirect("/admin/klienci");
  } catch (error) {
    // For redirect errors, rethrow them
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error updating client:", error);
    return {
      error: {
        _form: ["Wystąpił błąd podczas aktualizacji klienta. Spróbuj ponownie."],
      },
    };
  }

  return { success: true };
}

const updateSchema = z.object({
  accountType: z.enum(["ADMIN", "DETAL", "HURT"], {
    errorMap: () => ({ message: "Nieprawidłowy typ konta" }),
  }),
});

export async function updateClientType(
  clientId: string,
  accountType: "ADMIN" | "DETAL" | "HURT"
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate
    const result = updateSchema.safeParse({ accountType });
    if (!result.success) {
      return { success: false, message: "Nieprawidłowy typ konta" };
    }

    // Update client
    await prisma.user.update({
      where: { id: clientId },
      data: { accountType },
    });

    return { success: true, message: "Typ konta został zmieniony" };
  } catch (error) {
    console.error("Error updating client type:", error);
    return { success: false, message: "Wystąpił błąd podczas aktualizacji typu konta" };
  }
}

export async function deleteClient(
  clientId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if client has orders
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { _count: { select: { orders: true } } },
    });

    if (!client) {
      return { success: false, message: "Klient nie został znaleziony" };
    }

    if (client._count.orders > 0) {
      return {
        success: false,
        message: "Nie można usunąć klienta posiadającego zamówienia",
      };
    }

    // Delete client
    await prisma.user.delete({
      where: { id: clientId },
    });

    return { success: true, message: "Klient został usunięty" };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, message: "Wystąpił błąd podczas usuwania klienta" };
  }
}
