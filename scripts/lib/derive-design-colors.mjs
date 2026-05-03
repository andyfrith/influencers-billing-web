import {
  contrastTextOn,
  darkenHex,
  isDarkBackground,
  lightenHex,
  mixHex,
  normalizeHex,
  relativeLuminance,
} from "./color-utils.mjs";

/**
 * @typedef {{ primary: string; secondary: string; accent: string; background: string; surface: string; text: string }} ClubPaletteSeed
 */

/**
 * Builds the full `colors` object (same keys as root DESIGN.md) from a compact club seed.
 * @param {ClubPaletteSeed} seed
 * @returns {Record<string, string>}
 */
export function deriveMaterialColorsFromSeed(seed) {
  const P = normalizeHex(seed.primary);
  const S = normalizeHex(seed.secondary);
  const A = normalizeHex(seed.accent);
  const BG = normalizeHex(seed.background);
  const SF = normalizeHex(seed.surface);
  const TX = normalizeHex(seed.text);
  const darkBg = isDarkBackground(BG);

  const background = BG;
  const onBackground = TX;
  const surfaceContainer = SF;
  const surfaceDim = mixHex(BG, SF, 0.55);
  const surfaceBright = mixHex(SF, TX, 0.14);
  const surfaceContainerLowest = darkenHex(BG, darkBg ? 0.12 : 0.06);
  const surfaceContainerLow = mixHex(BG, SF, 0.38);
  const surfaceContainerHigh = mixHex(SF, P, darkBg ? 0.14 : 0.08);
  const surfaceContainerHighest = mixHex(SF, P, darkBg ? 0.26 : 0.16);
  const onSurface = TX;
  const onSurfaceVariant = mixHex(TX, SF, darkBg ? 0.42 : 0.35);
  const inverseSurface = TX;
  const inverseOnSurface = mixHex(BG, SF, 0.55);
  const outline = mixHex(SF, TX, 0.5);
  const outlineVariant = mixHex(SF, TX, darkBg ? 0.22 : 0.32);
  const surfaceTint = mixHex(A, SF, 0.45);

  const primaryContainer = P;
  const onPrimaryContainer = contrastTextOn(primaryContainer);
  const primarySoft = lightenHex(P, darkBg ? 0.32 : 0.45);
  const primary = mixHex(primarySoft, TX, darkBg ? 0.08 : 0.12);
  const onPrimary = contrastTextOn(primary);

  const inversePrimary = darkenHex(P, darkBg ? 0.18 : 0.12);

  const secondaryContainer = S;
  const onSecondaryContainer = contrastTextOn(secondaryContainer);
  const secondarySoft = darkBg ? lightenHex(S, 0.22) : darkenHex(S, 0.1);
  const secondary = mixHex(secondarySoft, TX, darkBg ? 0.12 : 0.1);
  const onSecondary = contrastTextOn(secondary);

  const tertiary = mixHex(SF, TX, 0.55);
  const onTertiary = contrastTextOn(tertiary);
  const tertiaryContainer = mixHex(SF, TX, 0.28);
  const onTertiaryContainer = contrastTextOn(tertiaryContainer);

  const error = darkBg ? "#ffb4ab" : "#b42318";
  const onError = darkBg ? "#690005" : "#ffffff";
  const errorContainer = darkBg ? "#93000a" : "#ffdad6";
  const onErrorContainer = darkBg ? "#ffdad6" : "#690005";

  const primaryFixed = mixHex(primary, lightenHex(P, 0.55), 0.5);
  const primaryFixedDim = mixHex(primary, P, 0.55);
  const onPrimaryFixed = contrastTextOn(primaryFixed);
  const onPrimaryFixedVariant = mixHex(onPrimaryFixed, P, 0.35);

  const secondaryFixed = mixHex(secondary, lightenHex(S, 0.4), 0.45);
  const secondaryFixedDim = mixHex(secondary, S, 0.55);
  const onSecondaryFixed = contrastTextOn(secondaryFixed);
  const onSecondaryFixedVariant = mixHex(onSecondaryFixed, S, 0.35);

  const tertiaryFixed = mixHex(tertiary, lightenHex(tertiary, 0.35), 0.4);
  const tertiaryFixedDim = darkenHex(tertiaryFixed, 0.08);
  const onTertiaryFixed = contrastTextOn(tertiaryFixed);
  const onTertiaryFixedVariant = mixHex(onTertiaryFixed, tertiary, 0.35);

  const surfaceVariant = surfaceContainerHighest;

  return {
    surface: surfaceContainer,
    "surface-dim": surfaceDim,
    "surface-bright": surfaceBright,
    "surface-container-lowest": surfaceContainerLowest,
    "surface-container-low": surfaceContainerLow,
    "surface-container": surfaceContainer,
    "surface-container-high": surfaceContainerHigh,
    "surface-container-highest": surfaceContainerHighest,
    "on-surface": onSurface,
    "on-surface-variant": onSurfaceVariant,
    "inverse-surface": inverseSurface,
    "inverse-on-surface": inverseOnSurface,
    outline,
    "outline-variant": outlineVariant,
    "surface-tint": surfaceTint,
    primary,
    "on-primary": onPrimary,
    "primary-container": primaryContainer,
    "on-primary-container": onPrimaryContainer,
    "inverse-primary": inversePrimary,
    secondary,
    "on-secondary": onSecondary,
    "secondary-container": secondaryContainer,
    "on-secondary-container": onSecondaryContainer,
    tertiary,
    "on-tertiary": onTertiary,
    "tertiary-container": tertiaryContainer,
    "on-tertiary-container": onTertiaryContainer,
    error,
    "on-error": onError,
    "error-container": errorContainer,
    "on-error-container": onErrorContainer,
    "primary-fixed": primaryFixed,
    "primary-fixed-dim": primaryFixedDim,
    "on-primary-fixed": onPrimaryFixed,
    "on-primary-fixed-variant": onPrimaryFixedVariant,
    "secondary-fixed": secondaryFixed,
    "secondary-fixed-dim": secondaryFixedDim,
    "on-secondary-fixed": onSecondaryFixed,
    "on-secondary-fixed-variant": onSecondaryFixedVariant,
    "tertiary-fixed": tertiaryFixed,
    "tertiary-fixed-dim": tertiaryFixedDim,
    "on-tertiary-fixed": onTertiaryFixed,
    "on-tertiary-fixed-variant": onTertiaryFixedVariant,
    background,
    "on-background": onBackground,
    "surface-variant": surfaceVariant,
  };
}

/**
 * @param {string} hex
 * @returns {string}
 */
export function primaryHoverFromContainer(hex) {
  const lum = relativeLuminance(hex);
  return lum > 0.55 ? darkenHex(hex, 0.08) : lightenHex(hex, 0.12);
}
