import { type NextRequest, NextResponse } from "next/server";

import { resolveClubLandingColorThemeId } from "@/data/clubs";
import { DISCOVER_ROUTE_COLOR_THEME_HEADER } from "@/lib/discover-club-theme";
import { DISCOVER_ROUTE_CLUB_SLUG_HEADER } from "@/lib/discover-club-slug-header";
import { CLUB_LANDING_PREVIEW_HEADER } from "@/lib/club-landing-preview";

const DISCOVER_CLUBS_BASE = "/discover/clubs";
const CLUB_LANDING_PREVIEW_PATH = "/preview/club-landing";

/**
 * Extracts the first path segment after `/discover/clubs` for club landing resolution.
 */
function discoverSlugFromPathname(pathname: string): string | undefined {
  if (pathname === DISCOVER_CLUBS_BASE || pathname === `${DISCOVER_CLUBS_BASE}/`) {
    return undefined;
  }
  if (!pathname.startsWith(`${DISCOVER_CLUBS_BASE}/`)) {
    return undefined;
  }
  const tail = pathname.slice(DISCOVER_CLUBS_BASE.length + 1);
  const first = tail.split("/")[0]?.trim();
  return first || undefined;
}

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);

  if (pathname === CLUB_LANDING_PREVIEW_PATH || pathname.startsWith(`${CLUB_LANDING_PREVIEW_PATH}/`)) {
    requestHeaders.set(CLUB_LANDING_PREVIEW_HEADER, "1");
  } else {
    requestHeaders.delete(CLUB_LANDING_PREVIEW_HEADER);
  }

  if (pathname === DISCOVER_CLUBS_BASE || pathname.startsWith(`${DISCOVER_CLUBS_BASE}/`)) {
    const slug = discoverSlugFromPathname(pathname);
    if (slug) {
      requestHeaders.set(DISCOVER_ROUTE_CLUB_SLUG_HEADER, slug);
      requestHeaders.delete(DISCOVER_ROUTE_COLOR_THEME_HEADER);
    } else {
      requestHeaders.delete(DISCOVER_ROUTE_CLUB_SLUG_HEADER);
      requestHeaders.set(
        DISCOVER_ROUTE_COLOR_THEME_HEADER,
        resolveClubLandingColorThemeId(undefined),
      );
    }
  } else {
    requestHeaders.delete(DISCOVER_ROUTE_CLUB_SLUG_HEADER);
    requestHeaders.delete(DISCOVER_ROUTE_COLOR_THEME_HEADER);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
