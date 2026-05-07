import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import {
  clubLandingRevisions,
  clubLandingVariations,
  clubs,
} from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";

/**
 * Loads variations, revision history, and the landing JSON for the selected revision (admin).
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const clubId = params.clubId;
    const url = new URL(request.url);
    const variationIdParam = url.searchParams.get("variationId")?.trim();
    const revisionIdParam = url.searchParams.get("revisionId")?.trim();

    const [club] = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      const [hasVariation] = await tx
        .select({ id: clubLandingVariations.id })
        .from(clubLandingVariations)
        .where(eq(clubLandingVariations.clubId, clubId))
        .limit(1);
      if (!hasVariation) {
        await tx.insert(clubLandingVariations).values({
          clubId,
          key: "default",
          displayName: "Default",
          updatedAt: new Date(),
        });
      }
    });

    const variationRows = await db
      .select()
      .from(clubLandingVariations)
      .where(eq(clubLandingVariations.clubId, clubId))
      .orderBy(clubLandingVariations.key);

    if (variationRows.length === 0) {
      return NextResponse.json({ error: "Failed to initialize variations." }, { status: 500 });
    }

    let selectedVariation =
      (variationIdParam
        ? variationRows.find((row) => row.id === variationIdParam)
        : undefined) ?? variationRows[0];
    if (!selectedVariation) {
      selectedVariation = variationRows[0];
    }

    const revisionRows = await db
      .select()
      .from(clubLandingRevisions)
      .where(eq(clubLandingRevisions.variationId, selectedVariation.id))
      .orderBy(desc(clubLandingRevisions.createdAt))
      .limit(80);

    let selectedRevision =
      (revisionIdParam
        ? revisionRows.find((row) => row.id === revisionIdParam)
        : undefined) ?? revisionRows[0];

    const revisionSummaries = revisionRows.map((row) => ({
      id: row.id,
      variationId: row.variationId,
      note: row.note,
      createdAt: row.createdAt.toISOString(),
      createdByUserId: row.createdByUserId,
      isPublished:
        club.publishedLandingRevisionId === row.id &&
        club.publishedLandingVariationId === selectedVariation.id,
    }));

    const variationSummaries = await Promise.all(
      variationRows.map(async (v) => {
        const [agg] = await db
          .select({ value: count() })
          .from(clubLandingRevisions)
          .where(eq(clubLandingRevisions.variationId, v.id));
        return {
          id: v.id,
          key: v.key,
          displayName: v.displayName,
          revisionCount: Number(agg?.value ?? 0),
          isPublishedLive: club.publishedLandingVariationId === v.id,
        };
      }),
    );

    return NextResponse.json({
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
        publishedLandingVariationId: club.publishedLandingVariationId,
        publishedLandingRevisionId: club.publishedLandingRevisionId,
        legacyLandingContent: club.landingContent ?? null,
      },
      variations: variationSummaries,
      selectedVariationId: selectedVariation.id,
      selectedRevisionId: selectedRevision?.id ?? null,
      revisions: revisionSummaries,
      landingContent: selectedRevision?.landingContent ?? null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load landing workspace." }, { status: 500 });
  }
}
