import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";

/**
 * Clears the live landing pointers so `/discover` falls back to legacy JSON or static defaults.
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const [club] = await db.select().from(clubs).where(eq(clubs.id, params.clubId)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const [updated] = await db
      .update(clubs)
      .set({
        publishedLandingVariationId: null,
        publishedLandingRevisionId: null,
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, params.clubId))
      .returning();

    return NextResponse.json({ club: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to unpublish landing." }, { status: 500 });
  }
}
