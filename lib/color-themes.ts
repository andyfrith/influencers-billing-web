import {
  CLUB_COLOR_THEME_IDS,
  CLUB_COLOR_THEME_OPTIONS,
} from "./club-color-themes.generated";

/**
 * Built-in color themes (each maps to a token bundle under `app/themes/*.css`).
 * Club themes are generated from `designs/`; ids live in `club-color-themes.generated.ts`.
 */
export const CORE_COLOR_THEME_IDS = [
  "amber-nocturne",
  "slate-studio",
  "nocturne-lavender",
  "obsidian-precision",
] as const;

export const COLOR_THEME_IDS = [
  ...CORE_COLOR_THEME_IDS,
  ...CLUB_COLOR_THEME_IDS,
] as const;

export type ColorThemeId = (typeof COLOR_THEME_IDS)[number];

export const DEFAULT_COLOR_THEME_ID: ColorThemeId = "amber-nocturne";

export type ColorThemeMeta = {
  id: ColorThemeId;
  /** Short label for pickers */
  label: string;
  /** Source design doc in repo (informational) */
  designDoc?: string;
};

export const CORE_COLOR_THEME_OPTIONS: readonly ColorThemeMeta[] = [
  { id: "amber-nocturne", label: "Amber Nocturne", designDoc: "DESIGN.md" },
  { id: "slate-studio", label: "Slate Studio", designDoc: "(add DESIGN.slate-studio.md)" },
  { id: "nocturne-lavender", label: "Nocturne Lavender", designDoc: "(add DESIGN.nocturne-lavender.md)" },
  { id: "obsidian-precision", label: "Obsidian Precision", designDoc: "(add DESIGN.obsidian-precision.md)" },
] as const;

export const COLOR_THEME_OPTIONS: readonly ColorThemeMeta[] = [
  ...CORE_COLOR_THEME_OPTIONS,
  ...CLUB_COLOR_THEME_OPTIONS,
];

/**
 * Returns whether `value` is a registered color theme id.
 */
export function isColorThemeId(value: string): value is ColorThemeId {
  return (COLOR_THEME_IDS as readonly string[]).includes(value);
}
