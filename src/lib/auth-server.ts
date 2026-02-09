"use server";

import prisma from "@/db";
import { hash, compare } from "bcrypt";

// Server-only password hashing
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

// Server-only password verification
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(plainPassword, hashedPassword);
}

// Server-only user lookup
export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      accountType: true,
    },
  });
  return user;
}

// Server-only user creation
export async function createUser(userData: {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  accountType?: string;
}) {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        // accountType defaults to DETAL in the Prisma schema
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Server-only user update
export async function updateUser(
  userId: string,
  userData: {
    firstName?: string | null;
    lastName?: string | null;
  }
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
