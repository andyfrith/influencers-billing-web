import { NextResponse } from "next/server";

import { verifyEmailToken } from "@/lib/users";
import { verifyEmailSchema } from "@/lib/validators/auth";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const isVerified = await verifyEmailToken(parsed.data.token);

    if (!isVerified) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    return NextResponse.json({ message: "Email verified." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to verify email." }, { status: 500 });
  }
}
