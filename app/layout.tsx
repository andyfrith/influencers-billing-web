import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { geistSans, geistMono, plusJakarta, inter } from "@/lib/fonts";
import "./globals.css";
import { AdminShell } from "@/components/admin/admin-shell";
import { AuthenticatedShell } from "@/components/authenticated/authenticated-shell";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { Providers } from "@/components/providers";
import { getAppSession } from "@/lib/session";
import {
  COLOR_THEME_IDS,
  DEFAULT_COLOR_THEME_ID,
  isColorThemeId,
  type ColorThemeId,
} from "@/lib/color-themes";
import { resolveDiscoverColorThemeForSlug } from "@/lib/club-landing-resolution";
import { DISCOVER_ROUTE_COLOR_THEME_HEADER } from "@/lib/discover-club-theme";
import { DISCOVER_ROUTE_CLUB_SLUG_HEADER } from "@/lib/discover-club-slug-header";
import {
  COLOR_THEME_STORAGE_KEY,
  parseColorThemeCookie,
  THEME_STORAGE_KEY,
} from "@/lib/theme-storage";
import { CLUB_LANDING_PREVIEW_HEADER } from "@/lib/club-landing-preview";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Influencers Billing",
  description: "Customer credit card management portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const session = await getAppSession();
  const isAdmin = session?.user?.role === "admin";
  const isAuthenticated = Boolean(session?.user?.id);
  const cookieStore = await cookies();
  const headerList = await headers();
  const themeCookie = cookieStore.get(THEME_STORAGE_KEY)?.value;
  const initialThemeIsLight = themeCookie === "light";

  const clubLandingPreviewFrame = headerList.get(CLUB_LANDING_PREVIEW_HEADER) === "1";

  const discoverSlugHeader = headerList.get(DISCOVER_ROUTE_CLUB_SLUG_HEADER)?.trim();
  const legacyDiscoverThemeHeader = headerList.get(DISCOVER_ROUTE_COLOR_THEME_HEADER);

  let routeColorThemeOverride: ColorThemeId | null = null;
  if (discoverSlugHeader != null && discoverSlugHeader !== "") {
    routeColorThemeOverride = await resolveDiscoverColorThemeForSlug(discoverSlugHeader);
  } else if (legacyDiscoverThemeHeader != null && isColorThemeId(legacyDiscoverThemeHeader)) {
    routeColorThemeOverride = legacyDiscoverThemeHeader;
  }

  const initialColorThemeId: ColorThemeId =
    routeColorThemeOverride ??
    parseColorThemeCookie(cookieStore.get(COLOR_THEME_STORAGE_KEY)?.value);

  const colorThemeAllowlist = JSON.stringify(
    Object.fromEntries(COLOR_THEME_IDS.map((id) => [id, true])),
  );
  const rtJsLiteral =
    routeColorThemeOverride !== null
      ? JSON.stringify(routeColorThemeOverride)
      : "null";
  const themeInitScript = `(function(){var el=document.documentElement;var SK=${JSON.stringify(THEME_STORAGE_KEY)};var CK=${JSON.stringify(COLOR_THEME_STORAGE_KEY)};var OK=${colorThemeAllowlist};var DEF=${JSON.stringify(DEFAULT_COLOR_THEME_ID)};var RT=${rtJsLiteral};function readCookie(k){try{var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)(?:;|$)"));return m?m[1]:null}catch(e){return null}}function readLs(k){try{return localStorage.getItem(k)}catch(e){return null}}var lum=readCookie(SK)||readLs(SK);if(lum==="light")el.classList.add("light");else if(lum==="dark")el.classList.remove("light");if(RT&&OK[RT])el.setAttribute("data-color-theme",RT);else{var ct=readCookie(CK)||readLs(CK);if(OK[ct])el.setAttribute("data-color-theme",ct);else el.setAttribute("data-color-theme",DEF)}})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-color-theme={initialColorThemeId}
      className={cn(
        geistSans.variable,
        geistMono.variable,
        plusJakarta.variable,
        inter.variable,
        "h-full antialiased",
        initialThemeIsLight && "light",
      )}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers
          initialColorThemeId={initialColorThemeId}
          initialThemeIsLight={initialThemeIsLight}
        >
          {clubLandingPreviewFrame ? (
            <div className="min-h-0 flex-1">{children}</div>
          ) : isAuthenticated && isAdmin ? (
            <AdminShell>{children}</AdminShell>
          ) : isAuthenticated ? (
            <AuthenticatedShell>{children}</AuthenticatedShell>
          ) : (
            <div className="flex min-h-full flex-1 flex-col">
              <PublicSiteHeader />
              <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
