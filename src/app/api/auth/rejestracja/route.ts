import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phoneNumber } = body;

    // Call the registerUser function from auth-utils which now uses server functions internally
    const result = await registerUser({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      message: result.message,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Wystąpił błąd podczas rejestracji" }, { status: 500 });
  }
}
