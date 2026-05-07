/**
 * Admin directory helpers: lifecycle phase and preview imagery from stored landing JSON.
 */

export type AdminClubLifecyclePhase = "live" | "in_design";

type ClubLifecycleInput = {
  publishedLandingRevisionId: string | null;
  hasLegacyLanding: boolean;
};

/**
 * Live = discover can use DB-backed landing (published revision or legacy JSON column).
 */
export function getAdminClubLifecyclePhase(input: ClubLifecycleInput): AdminClubLifecyclePhase {
  if (input.publishedLandingRevisionId != null) {
    return "live";
  }
  if (input.hasLegacyLanding) {
    return "live";
  }
  return "in_design";
}

type LandingLike = {
  hero?: { backgroundImage?: { src?: string } };
};

/**
 * Reads hero background URL from landing storage payload shape.
 */
export function getClubHeroPreviewSrcFromLanding(landing: unknown): string | null {
  if (landing == null || typeof landing !== "object") {
    return null;
  }
  const src = (landing as LandingLike).hero?.backgroundImage?.src;
  return typeof src === "string" && src.trim() !== "" ? src : null;
}
