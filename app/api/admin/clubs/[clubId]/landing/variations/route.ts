import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubLandingVariations, clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { createClubLandingVariationSchema } from "@/lib/validators/memberships";

/**
 * Creates a new empty variation (revisions are added via the revisions endpoint).
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const parsed = createClubLandingVariationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const [club] = await db.select().from(clubs).where(eq(clubs.id, params.clubId)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const [duplicate] = await db
      .select({ id: clubLandingVariations.id })
      .from(clubLandingVariations)
      .where(
        and(
          eq(clubLandingVariations.clubId, params.clubId),
          eq(clubLandingVariations.key, parsed.data.key),
        ),
      )
      .limit(1);
    if (duplicate) {
      return NextResponse.json({ error: "A variation with this key already exists." }, { status: 409 });
    }

    const [variation] = await db
      .insert(clubLandingVariations)
      .values({
        clubId: params.clubId,
        key: parsed.data.key,
        displayName: parsed.data.displayName,
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ variation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create variation." }, { status: 500 });
  }
}
