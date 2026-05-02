import {
  DEFAULT_COLOR_THEME_ID,
  isColorThemeId,
  type ColorThemeId,
} from "@/lib/color-themes";

/** localStorage + cookie name for light/dark appearance. */
export const THEME_STORAGE_KEY = "influencers-billing-theme";

/** localStorage + cookie name for named color theme (`data-color-theme` on `<html>`). */
export const COLOR_THEME_STORAGE_KEY = "influencers-color-theme";

export type ThemeChoice = "light" | "dark";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function persistCookie(key: string, value: string): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${key}=${value};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

/**
 * Reads the stored light/dark preference, or null if unset / unreadable.
 */
export function readStoredTheme(): ThemeChoice | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark") {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Reads the stored color theme id, or null if unset / invalid.
 */
export function readStoredColorTheme(): ColorThemeId | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(COLOR_THEME_STORAGE_KEY);
    if (raw && isColorThemeId(raw)) {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Applies light/dark on `<html>` (`class="light"`) and persists.
 */
export function applyTheme(theme: ThemeChoice): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.classList.toggle("light", theme === "light");
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  persistCookie(THEME_STORAGE_KEY, theme);
}

/**
 * Applies named color theme on `<html data-color-theme="…">` and persists.
 */
export function applyColorTheme(themeId: ColorThemeId): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-color-theme", themeId);
  try {
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, themeId);
  } catch {
    /* ignore */
  }
  persistCookie(COLOR_THEME_STORAGE_KEY, themeId);
}

/**
 * Resolves a cookie or header-derived string to a valid color theme id.
 */
export function parseColorThemeCookie(value: string | undefined): ColorThemeId {
  if (value && isColorThemeId(value)) {
    return value;
  }
  return DEFAULT_COLOR_THEME_ID;
}
