import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { Providers } from "@/components/providers";
import { getAppSession } from "@/lib/session";
import { COLOR_THEME_IDS, DEFAULT_COLOR_THEME_ID } from "@/lib/color-themes";
import {
  COLOR_THEME_STORAGE_KEY,
  parseColorThemeCookie,
  THEME_STORAGE_KEY,
} from "@/lib/theme-storage";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-club-kinetic",
  display: "swap",
});

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
  const isAuthenticated = Boolean(session?.user?.id);
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_STORAGE_KEY)?.value;
  const initialThemeIsLight = themeCookie === "light";
  const initialColorThemeId = parseColorThemeCookie(cookieStore.get(COLOR_THEME_STORAGE_KEY)?.value);

  const colorThemeAllowlist = JSON.stringify(
    Object.fromEntries(COLOR_THEME_IDS.map((id) => [id, true])),
  );
  const themeInitScript = `(function(){var el=document.documentElement;var SK=${JSON.stringify(THEME_STORAGE_KEY)};var CK=${JSON.stringify(COLOR_THEME_STORAGE_KEY)};var OK=${colorThemeAllowlist};var DEF=${JSON.stringify(DEFAULT_COLOR_THEME_ID)};function readCookie(k){try{var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)(?:;|$)"));return m?m[1]:null}catch(e){return null}}function readLs(k){try{return localStorage.getItem(k)}catch(e){return null}}var lum=readCookie(SK)||readLs(SK);if(lum==="light")el.classList.add("light");else if(lum==="dark")el.classList.remove("light");var ct=readCookie(CK)||readLs(CK);if(OK[ct])el.setAttribute("data-color-theme",ct);else el.setAttribute("data-color-theme",DEF);})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-color-theme={initialColorThemeId}
      className={cn(
        geistSans.variable,
        geistMono.variable,
        plusJakarta.variable,
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
        <Providers initialColorThemeId={initialColorThemeId} initialThemeIsLight={initialThemeIsLight}>
          {isAuthenticated ? (
            <AuthenticatedShell isAdmin={session?.user?.role === "admin"}>
              {children}
            </AuthenticatedShell>
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
