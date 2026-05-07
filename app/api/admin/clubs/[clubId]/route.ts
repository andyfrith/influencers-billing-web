import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubs } from "@/db/schema";
import {
  getAdminClubLifecyclePhase,
  getClubHeroPreviewSrcFromLanding,
} from "@/lib/admin-club-directory";
import { requireAdminSession } from "@/lib/authorization";

/**
 * Returns one club for admin detail views.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const { clubId } = await context.params;
    const [row] = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1);
    if (!row) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const hasLegacyLanding = row.landingContent != null;
    const heroPreviewSrc = getClubHeroPreviewSrcFromLanding(row.landingContent);

    return NextResponse.json({
      club: {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        contextMarkdown: row.contextMarkdown,
        status: row.status,
        publishedLandingVariationId: row.publishedLandingVariationId,
        publishedLandingRevisionId: row.publishedLandingRevisionId,
        heroPreviewSrc,
        lifecyclePhase: getAdminClubLifecyclePhase({
          publishedLandingRevisionId: row.publishedLandingRevisionId,
          hasLegacyLanding,
        }),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load club." }, { status: 500 });
  }
}
