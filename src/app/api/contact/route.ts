import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { contactInfo } from "@/app/(customFacing)/data";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const sent = await sendMail({
      to: contactInfo.email,
      subject: `[Kontakt] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nowa wiadomość z formularza kontaktowego</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555; width: 120px;">Imię i nazwisko</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">
                <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Temat</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
            <h3 style="color: #555; margin-top: 0;">Treść wiadomości:</h3>
            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Wiadomość wysłana z formularza kontaktowego na drcoco.pl</p>
        </div>
      `,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
