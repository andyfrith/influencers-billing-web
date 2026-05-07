import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubLandingRevisions, clubLandingVariations, clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { publishClubLandingSchema } from "@/lib/validators/memberships";

/**
 * Points the live `/discover/clubs/:slug` landing at a specific immutable revision.
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const parsed = publishClubLandingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const [club] = await db.select().from(clubs).where(eq(clubs.id, params.clubId)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const [variation] = await db
      .select()
      .from(clubLandingVariations)
      .where(
        and(
          eq(clubLandingVariations.id, parsed.data.variationId),
          eq(clubLandingVariations.clubId, params.clubId),
        ),
      )
      .limit(1);
    if (!variation) {
      return NextResponse.json({ error: "Variation not found." }, { status: 404 });
    }

    const [revision] = await db
      .select()
      .from(clubLandingRevisions)
      .where(
        and(
          eq(clubLandingRevisions.id, parsed.data.revisionId),
          eq(clubLandingRevisions.variationId, parsed.data.variationId),
        ),
      )
      .limit(1);
    if (!revision) {
      return NextResponse.json({ error: "Revision not found." }, { status: 404 });
    }

    const [updated] = await db
      .update(clubs)
      .set({
        publishedLandingVariationId: parsed.data.variationId,
        publishedLandingRevisionId: parsed.data.revisionId,
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, params.clubId))
      .returning();

    return NextResponse.json({ club: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to publish landing." }, { status: 500 });
  }
}
