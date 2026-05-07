import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubLandingRevisions, clubLandingVariations, clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { createClubLandingRevisionSchema } from "@/lib/validators/memberships";

/**
 * Appends an immutable landing snapshot for a variation. Optionally publishes immediately.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const auth = await requireAdminSession();
  if (auth.errorResponse) {
    return auth.errorResponse;
  }
  const session = auth.session;

  try {
    const params = await context.params;
    const parsed = createClubLandingRevisionSchema.safeParse(await request.json());
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

    const userId = session.user.id;

    const [revision] = await db
      .insert(clubLandingRevisions)
      .values({
        variationId: parsed.data.variationId,
        landingContent: parsed.data.landingContent,
        note: parsed.data.note ?? null,
        createdByUserId: userId ?? null,
      })
      .returning();

    if (club.status === "new") {
      await db
        .update(clubs)
        .set({
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(clubs.id, params.clubId));
    }

    if (parsed.data.publish === true) {
      await db
        .update(clubs)
        .set({
          publishedLandingVariationId: parsed.data.variationId,
          publishedLandingRevisionId: revision.id,
          updatedAt: new Date(),
        })
        .where(eq(clubs.id, params.clubId));
    }

    return NextResponse.json({ revision });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save revision." }, { status: 500 });
  }
}
