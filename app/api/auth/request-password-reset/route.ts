import { NextResponse } from "next/server";

import { sendPasswordResetEmail } from "@/lib/email";
import { createPasswordResetTokenForEmail } from "@/lib/users";
import { requestPasswordResetSchema } from "@/lib/validators/auth";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = requestPasswordResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const token = await createPasswordResetTokenForEmail(parsed.data.email);

    if (token) {
      try {
        await sendPasswordResetEmail({
          to: parsed.data.email.toLowerCase(),
          token,
        });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
      }
    }

    return NextResponse.json({
      message:
        "If this email is registered, a password reset link has been generated.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to process password reset request." },
      { status: 500 },
    );
  }
}
