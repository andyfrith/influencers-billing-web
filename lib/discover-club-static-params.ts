import { eq } from "drizzle-orm";

import { clubLandingContent, clubLandingDisplayNameToSlug } from "@/data/clubs";
import { db } from "@/db/client";
import { clubs } from "@/db/schema";

/**
 * Path segments for `/discover/clubs/[slug]`, `/join/clubs/[slug]`, and `/sign-in/clubs/[slug]`,
 * combining active database clubs with statically defined landing entries.
 */
export async function getDiscoverClubSlugParams(): Promise<{ slug: string }[]> {
  const activeRows = await db.select({ slug: clubs.slug }).from(clubs).where(eq(clubs.status, "active"));
  const fromDb = activeRows.map((row) => row.slug.trim().toLowerCase()).filter(Boolean);
  const fromStatic = clubLandingContent.map((entry) => clubLandingDisplayNameToSlug(entry.name));
  const merged = [...new Set([...fromDb, ...fromStatic])];
  return merged.map((slug) => ({ slug }));
}
