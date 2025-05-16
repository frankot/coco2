import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phoneNumber } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: "Email i hasło są wymagane" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Użytkownik o podanym adresie email już istnieje" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user with optional fields
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        phoneNumber: phoneNumber || null,
        accountType: "DETAL", // Default account type
      },
    });

    return NextResponse.json({
      message: "Konto zostało utworzone pomyślnie",
      userId: user.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Wystąpił błąd podczas rejestracji" }, { status: 500 });
  }
}
