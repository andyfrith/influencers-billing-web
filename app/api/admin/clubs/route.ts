import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { createClubSchema } from "@/lib/validators/memberships";

export async function GET(): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const rows = await db.select().from(clubs);
    return NextResponse.json({ clubs: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load clubs." }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const parsed = createClubSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const [existing] = await db.select().from(clubs).where(eq(clubs.slug, parsed.data.slug)).limit(1);
    if (existing) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
    }

    const [club] = await db.insert(clubs).values(parsed.data).returning();
    return NextResponse.json({ club });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create club." }, { status: 500 });
  }
}
