/**
 * Request header set by middleware so the root layout can render a minimal shell for the
 * Club landing preview iframe (club themes target `html[data-color-theme]`).
 */
export const CLUB_LANDING_PREVIEW_HEADER = "x-club-landing-preview";

/** postMessage `type` for preview iframe ↔ admin editor (same origin). */
export const CLUB_LANDING_PREVIEW_MESSAGE_TYPE = "influencers:club-landing-preview-v1";
