import { and, eq, sql } from "drizzle-orm";

import type { ClubLandingContent, ClubLandingStoragePayload } from "@/data/club-landing-types";
import { db } from "@/db/client";
import { clubLandingRevisions, clubs } from "@/db/schema";
import {
  resolveClubLandingColorThemeId,
  resolveClubLandingContent,
} from "@/data/clubs";
import { isColorThemeId, type ColorThemeId } from "@/lib/color-themes";
import {
  clubLandingStoragePayloadSchema,
  type ClubLandingStoragePayloadInput,
} from "@/lib/validators/club-landing";

/**
 * Merges a validated landing payload with a club row for rendering.
 */
function clubLandingFromDbRow(
  club: { id: string; name: string; slug: string },
  payload: ClubLandingStoragePayloadInput,
): ClubLandingContent {
  return {
    id: 0,
    name: payload.name.trim() || club.name,
    colorThemeId: payload.colorThemeId,
    sections: payload.sections,
    sectionOrder: payload.sectionOrder,
    join: payload.join,
    login: payload.login,
    hero: payload.hero,
    benefits: payload.benefits,
    explore: payload.explore,
    attention: payload.attention,
  };
}

/**
 * Loads landing page content for a URL slug, preferring `clubs.landing_content` when present.
 */
export async function resolveClubLandingPageContent(
  slug: string | undefined,
): Promise<ClubLandingContent> {
  const trimmed = slug?.trim();
  if (trimmed == null || trimmed === "") {
    return resolveClubLandingContent(undefined);
  }

  const [row] = await db
    .select({
      club: clubs,
      publishedPayload: clubLandingRevisions.landingContent,
    })
    .from(clubs)
    .leftJoin(
      clubLandingRevisions,
      eq(clubs.publishedLandingRevisionId, clubLandingRevisions.id),
    )
    .where(and(sql`lower(${clubs.slug}) = ${trimmed.toLowerCase()}`, eq(clubs.status, "active")))
    .limit(1);

  const club = row?.club;
  if (!club) {
    return resolveClubLandingContent(trimmed);
  }

  if (row.publishedPayload != null) {
    const parsed = clubLandingStoragePayloadSchema.safeParse(row.publishedPayload);
    if (parsed.success) {
      return clubLandingFromDbRow(club, parsed.data);
    }
  }

  if (club.landingContent != null) {
    const parsed = clubLandingStoragePayloadSchema.safeParse(club.landingContent);
    if (parsed.success) {
      return clubLandingFromDbRow(club, parsed.data);
    }
  }

  return resolveClubLandingContent(trimmed);
}

/**
 * Resolves the color theme for a discover-route slug, using DB landing when available.
 * Intended for the root layout (Node runtime) where PostgreSQL is reachable.
 */
export async function resolveDiscoverColorThemeForSlug(
  slug: string | undefined,
): Promise<ColorThemeId> {
  const trimmed = slug?.trim();
  if (trimmed == null || trimmed === "") {
    return resolveClubLandingColorThemeId(undefined);
  }

  const [row] = await db
    .select({
      legacyLanding: clubs.landingContent,
      publishedPayload: clubLandingRevisions.landingContent,
    })
    .from(clubs)
    .leftJoin(
      clubLandingRevisions,
      eq(clubs.publishedLandingRevisionId, clubLandingRevisions.id),
    )
    .where(and(sql`lower(${clubs.slug}) = ${trimmed.toLowerCase()}`, eq(clubs.status, "active")))
    .limit(1);

  const publishedRaw = row?.publishedPayload;
  if (publishedRaw && typeof publishedRaw === "object" && "colorThemeId" in publishedRaw) {
    const candidate = (publishedRaw as ClubLandingStoragePayload).colorThemeId;
    if (typeof candidate === "string" && isColorThemeId(candidate)) {
      return candidate;
    }
  }

  const legacyRaw = row?.legacyLanding;
  if (legacyRaw && typeof legacyRaw === "object" && "colorThemeId" in legacyRaw) {
    const candidate = (legacyRaw as ClubLandingStoragePayload).colorThemeId;
    if (typeof candidate === "string" && isColorThemeId(candidate)) {
      return candidate;
    }
  }

  return resolveClubLandingColorThemeId(trimmed);
}
