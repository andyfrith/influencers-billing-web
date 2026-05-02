"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import type { ColorThemeId } from "@/lib/color-themes";
import {
  applyColorTheme,
  applyTheme,
  COLOR_THEME_STORAGE_KEY,
  parseColorThemeCookie,
  THEME_STORAGE_KEY,
  type ThemeChoice,
} from "@/lib/theme-storage";

type ThemeContextValue = {
  theme: ThemeChoice;
  setTheme: (theme: ThemeChoice) => void;
  toggleTheme: () => void;
  colorTheme: ColorThemeId;
  setColorTheme: (themeId: ColorThemeId) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  /** From `cookies()` — first paint matches saved light/dark. */
  initialIsLight: boolean;
  /** From `cookies()` — first paint matches saved named color theme. */
  initialColorThemeId: ColorThemeId;
  children: React.ReactNode;
};

/**
 * Syncs `<html class="light">` and `<html data-color-theme>` with persisted preferences.
 */
export function ThemeProvider({
  initialIsLight,
  initialColorThemeId,
  children,
}: ThemeProviderProps): React.JSX.Element {
  const router = useRouter();
  const [theme, setThemeState] = React.useState<ThemeChoice>(() =>
    initialIsLight ? "light" : "dark",
  );
  const [colorTheme, setColorThemeState] = React.useState<ColorThemeId>(() => initialColorThemeId);

  React.useLayoutEffect(() => {
    const domLight = document.documentElement.classList.contains("light");
    setThemeState(domLight ? "light" : "dark");
    const attr = document.documentElement.getAttribute("data-color-theme");
    setColorThemeState(parseColorThemeCookie(attr ?? undefined));
  }, []);

  const setTheme = React.useCallback(
    (next: ThemeChoice) => {
      setThemeState(next);
      applyTheme(next);
      router.refresh();
    },
    [router],
  );

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      router.refresh();
      return next;
    });
  }, [router]);

  const setColorTheme = React.useCallback(
    (themeId: ColorThemeId) => {
      setColorThemeState(themeId);
      applyColorTheme(themeId);
      router.refresh();
    },
    [router],
  );

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!event.newValue) {
        return;
      }
      if (event.key === THEME_STORAGE_KEY && (event.newValue === "light" || event.newValue === "dark")) {
        setThemeState(event.newValue);
        document.documentElement.classList.toggle("light", event.newValue === "light");
        return;
      }
      if (event.key === COLOR_THEME_STORAGE_KEY) {
        const next = parseColorThemeCookie(event.newValue);
        setColorThemeState(next);
        document.documentElement.setAttribute("data-color-theme", next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme, colorTheme, setColorTheme }),
    [theme, setTheme, toggleTheme, colorTheme, setColorTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Returns theme controls when rendered inside {@link ThemeProvider}.
 */
export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
