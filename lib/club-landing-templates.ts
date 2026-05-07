import { clubLandingContent, clubLandingDisplayNameToSlug } from "@/data/clubs";
import type { ClubLandingContent } from "@/data/club-landing-types";
import type { ClubLandingStoragePayloadInput } from "@/lib/validators/club-landing";

export type ClubLandingTemplateMeta = {
  slug: string;
  label: string;
};

/**
 * Standard landing layouts bundled from design exports (`data/clubs`).
 */
export function listClubLandingTemplates(): ClubLandingTemplateMeta[] {
  return clubLandingContent.map((entry) => ({
    slug: clubLandingDisplayNameToSlug(entry.name),
    label: entry.name,
  }));
}

function landingEntryToStoragePayload(entry: ClubLandingContent): ClubLandingStoragePayloadInput {
  const { id: _id, ...payload } = entry;
  return payload;
}

/**
 * Returns the persisted landing shape for a template slug, or `null` if unknown.
 */
export function getClubLandingTemplatePayload(slug: string): ClubLandingStoragePayloadInput | null {
  const normalized = slug.trim().toLowerCase();
  const entry = clubLandingContent.find(
    (row) => clubLandingDisplayNameToSlug(row.name).toLowerCase() === normalized,
  );
  return entry ? structuredClone(landingEntryToStoragePayload(entry)) : null;
}
