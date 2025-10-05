import { PrismaClient } from "@/app/generated/prisma";
import { z } from "zod";
import {
  hashPassword,
  verifyPassword,
  findUserByEmail,
  createUser,
  updateUser,
} from "./auth-server";

const prisma = new PrismaClient();

// Validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email("Niepoprawny adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  phoneNumber: z.string().min(1, "Numer telefonu jest wymagany"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Niepoprawny adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

// Type definitions
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;

// User authentication functions
export async function registerUser(userData: UserRegistrationData) {
  try {
    // Validate user data
    const validatedData = userRegistrationSchema.parse(userData);

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);

    if (existingUser) {
      return {
        success: false,
        message: "Użytkownik o podanym adresie email już istnieje",
      };
    }

    // Create new user with server function
    const user = await createUser({
      email: validatedData.email,
      password: validatedData.password,
      firstName: validatedData.firstName || null,
      lastName: validatedData.lastName || null,
      phoneNumber: validatedData.phoneNumber || null,
    });

    return {
      success: true,
      message: "Konto zostało utworzone pomyślnie",
      userId: user.id,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Wystąpił błąd podczas rejestracji",
    };
  }
}

export async function createOrUpdateUser(userData: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(userData.email);

    if (existingUser) {
      // Always update existing user with the new information if provided
      const updatedUser = await updateUser(existingUser.id, {
        firstName: userData.firstName !== undefined ? userData.firstName : existingUser.firstName,
        lastName: userData.lastName !== undefined ? userData.lastName : existingUser.lastName,
        phoneNumber:
          userData.phoneNumber !== undefined ? userData.phoneNumber : existingUser.phoneNumber,
      });

      return {
        success: true,
        message: "Dane użytkownika zostały zaktualizowane",
        userId: updatedUser.id,
        isNewUser: false,
      };
    }

    // Create new user - for guest checkout, we don't require a password
    // Generate a temporary password if none provided (for guest checkout)
    let userPassword = userData.password;
    if (!userPassword) {
      // For guest users, create a random temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      userPassword = tempPassword;
    }

    const newUser = await createUser({
      email: userData.email,
      password: userPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      phoneNumber: userData.phoneNumber || null,
    });

    return {
      success: true,
      message: "Konto zostało utworzone pomyślnie",
      userId: newUser.id,
      isNewUser: true,
    };
  } catch (error) {
    console.error("User creation/update error:", error);
    return {
      success: false,
      message: "Wystąpił błąd podczas przetwarzania danych użytkownika",
    };
  }
}

export async function verifyUserCredentials(credentials: UserLoginData) {
  try {
    // Validate credentials
    const validatedData = userLoginSchema.parse(credentials);

    // Look up the user in the database
    const user = await findUserByEmail(validatedData.email);

    if (!user) {
      return {
        success: false,
        message: "Nieprawidłowy email lub hasło",
      };
    }

    // Compare the password with the stored hash
    const passwordMatch = await verifyPassword(validatedData.password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Nieprawidłowy email lub hasło",
      };
    }

    return {
      success: true,
      message: "Logowanie zakończone sukcesem",
      userId: user.id,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Wystąpił błąd podczas logowania",
    };
  }
}
