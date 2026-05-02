"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme-provider";
import type { ColorThemeId } from "@/lib/color-themes";

type ProvidersProps = {
  children: React.ReactNode;
  /** Server-derived initial light/dark (see root layout `cookies()`). */
  initialThemeIsLight: boolean;
  /** Server-derived named color theme (`data-color-theme`). */
  initialColorThemeId: ColorThemeId;
};

/**
 * App-level providers for session, query state, and color scheme.
 */
export function Providers({
  initialThemeIsLight,
  initialColorThemeId,
  children,
}: ProvidersProps): React.JSX.Element {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <ThemeProvider initialColorThemeId={initialColorThemeId} initialIsLight={initialThemeIsLight}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
