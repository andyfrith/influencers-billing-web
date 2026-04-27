import { NextResponse } from "next/server";

import { resetPasswordByToken } from "@/lib/users";
import { resetPasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const isUpdated = await resetPasswordByToken(
      parsed.data.token,
      parsed.data.password,
    );

    if (!isUpdated) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    return NextResponse.json({ message: "Password has been updated." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}
