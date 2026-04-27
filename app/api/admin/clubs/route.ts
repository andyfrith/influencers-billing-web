import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { createClubSchema, updateClubStatusSchema } from "@/lib/validators/memberships";

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

export async function PATCH(request: Request): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const payload = (await request.json()) as { clubId?: string; status?: string };
    if (!payload.clubId) {
      return NextResponse.json({ error: "clubId is required." }, { status: 400 });
    }

    const parsed = updateClubStatusSchema.safeParse({ status: payload.status });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const [club] = await db.select().from(clubs).where(eq(clubs.id, payload.clubId)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const [updated] = await db
      .update(clubs)
      .set({
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, club.id))
      .returning();

    return NextResponse.json({ club: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update club status." }, { status: 500 });
  }
}
