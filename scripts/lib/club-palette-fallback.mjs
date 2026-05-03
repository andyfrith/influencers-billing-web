import { darkenHex, lightenHex, mixHex, normalizeHex } from "./color-utils.mjs";

/**
 * Fills optional club seed keys so derivation always has a full hex set.
 * @param {Record<string, string>} raw
 * @returns {{ primary: string; secondary: string; accent: string; background: string; surface: string; text: string }}
 */
export function normalizeClubSeed(raw) {
  const primary = normalizeHex(raw.primary ?? "#6366f1");
  const secondary = normalizeHex(raw.secondary ?? primary);
  const accent = normalizeHex(raw.accent ?? raw.secondary ?? primary);
  const background = normalizeHex(raw.background ?? "#0f0f0f");
  const surface = normalizeHex(raw.surface ?? mixHex(background, "#ffffff", 0.12));
  const text = normalizeHex(raw.text ?? "#f4f4f5");
  return { primary, secondary, accent, background, surface, text };
}

/**
 * Builds a plausible dark-mode club palette when the design doc only ships light_mode.
 * @param {Record<string, string>} lightRaw
 * @returns {{ primary: string; secondary: string; accent: string; background: string; surface: string; text: string }}
 */
export function inferDarkModeFromLight(lightRaw) {
  const light = normalizeClubSeed(lightRaw);
  const background = darkenHex(light.background, 0.88);
  const surface = mixHex(background, mixHex(light.primary, "#ffffff", 0.35), 0.22);
  const text = mixHex(light.background, "#ffffff", 0.92);
  const primary = mixHex(light.primary, "#ffffff", 0.35);
  const secondary = darkenHex(light.secondary, 0.15);
  const accent = mixHex(light.accent, light.primary, 0.4);
  return normalizeClubSeed({
    primary,
    secondary,
    accent,
    background,
    surface,
    text,
  });
}

/**
 * Builds a light companion palette when the design doc only ships dark_mode.
 * @param {Record<string, string>} darkRaw
 * @returns {{ primary: string; secondary: string; accent: string; background: string; surface: string; text: string }}
 */
export function inferLightModeFromDark(darkRaw) {
  const dark = normalizeClubSeed(darkRaw);
  const background = lightenHex(mixHex(dark.background, "#ffffff", 0.94), 0.08);
  const surface = "#ffffff";
  const text = darkenHex(mixHex(dark.text, dark.background, 0.5), 0.35);
  const primary = darkenHex(dark.primary, 0.12);
  const secondary = mixHex(dark.secondary, "#ffffff", 0.35);
  const accent = mixHex(dark.accent, dark.primary, 0.35);
  return normalizeClubSeed({
    primary,
    secondary,
    accent,
    background,
    surface,
    text,
  });
}
