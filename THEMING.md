# Theming (multiple design bundles)

This app separates **appearance** (light / dark) from **color theme** (named token bundles). Together they map the same Tailwind semantic utilities (`bg-background`, `text-primary`, …) to different palettes.

## Concepts

| Control | HTML | Storage keys |
|--------|------|----------------|
| Light / dark | `class="light"` on `<html>` | `influencers-billing-theme` = `light` \| `dark` |
| Named color theme | `data-color-theme="…"` on `<html>` | `influencers-color-theme` = theme id |

Both values are mirrored in **cookies** (for SSR) and **localStorage** (for client + `beforeInteractive` script).

## Adding a theme from a new `DESIGN.md`

1. **Register the id** in `lib/color-themes.ts`: add to `COLOR_THEME_IDS`, `COLOR_THEME_OPTIONS`, and keep labels accurate.
2. **Add a CSS bundle** under `app/themes/<id>.css` with two blocks:
   - `html[data-color-theme="<id>"] { … }` — dark (or default) semantic variables
   - `html[data-color-theme="<id>"].light { … }` — light companion for the same id
3. **Import the file** in `app/globals.css` after the other `@import "./themes/…";` lines.
4. **No manual allowlist edit** — `app/layout.tsx` builds the init-script allowlist from `COLOR_THEME_IDS`, so new ids are accepted as soon as they appear in `lib/color-themes.ts`.
5. **Optional:** add `DESIGN.<id>.md` (or keep a single `DESIGN.md` per product line) and reference its filename in `COLOR_THEME_OPTIONS[].designDoc`.

Variable names must match the existing contract (`--background`, `--primary`, `--surface-panel`, `--form-error-text`, …) so components do not change.

## Files

| File | Role |
|------|------|
| `app/globals.css` | Tailwind import, shared radius/typography, `@theme inline` wiring |
| `app/themes/*.css` | Per-theme CSS custom properties |
| `lib/color-themes.ts` | Theme id registry + metadata |
| `lib/theme-storage.ts` | Persistence + `applyTheme` / `applyColorTheme` |
| `components/theme-provider.tsx` | React context + `router.refresh()` after writes |
| `components/theme-picker.tsx` | `<select>` bound to `setColorTheme` |
| `components/theme-toggle.tsx` | Light / dark toggle |

## Reference themes

- **`amber-nocturne`** — warm palette aligned with root `DESIGN.md` (Amber Nocturne).
- **`slate-studio`** — cool neutral + teal accent sample to prove a second bundle end-to-end.
