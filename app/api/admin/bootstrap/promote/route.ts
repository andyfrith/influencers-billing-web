import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { promoteAdminSchema } from "@/lib/validators/memberships";

/**
 * Local/dev bootstrap endpoint for creating the initial admin user.
 * Requires ADMIN_BOOTSTRAP_KEY and should be removed/disabled in strict production setups.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const parsed = promoteAdminSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const expectedKey = process.env.ADMIN_BOOTSTRAP_KEY;
    if (!expectedKey) {
      return NextResponse.json(
        { error: "ADMIN_BOOTSTRAP_KEY is not configured." },
        { status: 500 },
      );
    }

    if (parsed.data.bootstrapKey !== expectedKey) {
      return NextResponse.json({ error: "Invalid bootstrap key." }, { status: 403 });
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await db
      .update(users)
      .set({
        role: "admin",
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ message: "User promoted to admin." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to promote admin user." }, { status: 500 });
  }
}
