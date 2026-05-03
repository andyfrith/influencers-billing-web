/**
 * Named color themes (each maps to a token bundle under `app/themes/*.css`).
 * Add a new id here, ship a matching CSS file, and optionally pair with a `DESIGN*.md` spec.
 */
export const COLOR_THEME_IDS = [
  "amber-nocturne",
  "slate-studio",
  "nocturne-lavender",
  "obsidian-precision",
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

export const COLOR_THEME_OPTIONS: readonly ColorThemeMeta[] = [
  { id: "amber-nocturne", label: "Amber Nocturne", designDoc: "DESIGN.md" },
  { id: "slate-studio", label: "Slate Studio", designDoc: "(add DESIGN.slate-studio.md)" },
  { id: "nocturne-lavender", label: "Nocturne Lavender", designDoc: "(add DESIGN.nocturne-lavender.md)" },
  { id: "obsidian-precision", label: "Obsidian Precision", designDoc: "(add DESIGN.obsidian-precision.md)" },
] as const;

/**
 * Returns whether `value` is a registered color theme id.
 */
export function isColorThemeId(value: string): value is ColorThemeId {
  return (COLOR_THEME_IDS as readonly string[]).includes(value);
}
