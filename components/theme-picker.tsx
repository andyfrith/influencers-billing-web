"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useTheme } from "@/components/theme-provider";
import { discoverSlugForColorThemeId } from "@/data/clubs";
import { COLOR_THEME_OPTIONS, type ColorThemeId } from "@/lib/color-themes";
import { cn } from "@/lib/utils";

type ThemePickerProps = {
  className?: string;
};

/**
 * Selects the active named color theme (`data-color-theme`); pairs with light/dark from {@link ThemeToggle}.
 */
export function ThemePicker({ className }: ThemePickerProps): React.JSX.Element {
  const router = useRouter();
  const { colorTheme, setColorTheme } = useTheme();

  const onColorThemeChange = React.useCallback(
    (next: ColorThemeId) => {
      setColorTheme(next);
      const slug = discoverSlugForColorThemeId(next);
      if (slug) {
        router.push(`/discover/clubs/${slug}`);
      }
    },
    [router, setColorTheme],
  );

  return (
    <label className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="sr-only">Color theme</span>
      <select
        value={colorTheme}
        onChange={(event) =>
          onColorThemeChange(event.target.value as ColorThemeId)
        }
        className="h-9 max-w-[min(100%,14rem)] cursor-pointer rounded-md border border-border bg-card px-2 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Color theme"
      >
        {COLOR_THEME_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
