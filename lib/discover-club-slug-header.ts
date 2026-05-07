/**
 * Request header set by middleware on `/discover/clubs/*` routes so the root layout can
 * resolve the club color theme from PostgreSQL (middleware cannot use the Node `pg` pool).
 */
export const DISCOVER_ROUTE_CLUB_SLUG_HEADER = "x-influencers-discover-club-slug";
