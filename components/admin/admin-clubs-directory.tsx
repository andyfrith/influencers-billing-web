"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AdminClubLifecyclePhase } from "@/lib/admin-club-directory";

export type AdminClubDirectoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  contextMarkdown: string;
  status: "new" | "active" | "archived";
  publishedLandingRevisionId: string | null;
  heroPreviewSrc: string | null;
  lifecyclePhase: AdminClubLifecyclePhase;
};

type PhaseFilter = "all" | AdminClubLifecyclePhase;

function matchesSearch(club: AdminClubDirectoryRow, q: string): boolean {
  if (!q.trim()) {
    return true;
  }
  const n = q.trim().toLowerCase();
  return (
    club.name.toLowerCase().includes(n) ||
    club.slug.toLowerCase().includes(n) ||
    club.description.toLowerCase().includes(n)
  );
}

/**
 * Thumbnail card linking to club admin detail.
 */
function ClubThumbnailCard({ club }: { club: AdminClubDirectoryRow }): React.JSX.Element {
  const initial = club.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href={`/admin/clubs/${club.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        club.status === "archived" && "opacity-80",
      )}
    >
      <div className="aspect-[4/3] w-full bg-muted">
        {club.heroPreviewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-provided URLs
          <img
            src={club.heroPreviewSrc}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/25 via-muted to-muted">
            <span className="text-4xl font-semibold text-primary/80">{initial}</span>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-3 pb-3 pt-10">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              club.status === "new"
                ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                : club.lifecyclePhase === "live"
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/20 text-amber-800 dark:text-amber-300",
            )}
          >
            {club.status === "new" ? "New" : club.lifecyclePhase === "live" ? "Live" : "In design"}
          </span>
          {club.status === "archived" ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Archived
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate font-semibold text-foreground">{club.name}</p>
        <p className="truncate font-mono text-xs text-muted-foreground">{club.slug}</p>
      </div>
    </Link>
  );
}

/**
 * Filterable grid of clubs for `/admin/clubs`.
 */
export function AdminClubsDirectory(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const phaseParam = searchParams.get("phase");
  const phaseFilter: PhaseFilter =
    phaseParam === "in_design" || phaseParam === "live" ? phaseParam : "all";

  const [search, setSearch] = React.useState("");

  const clubsQuery = useQuery({
    queryKey: ["admin-clubs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/clubs");
      const payload = (await response.json()) as { clubs?: AdminClubDirectoryRow[]; error?: string };
      if (!response.ok || !payload.clubs) {
        throw new Error(payload.error ?? "Failed to load clubs.");
      }
      return payload.clubs;
    },
  });

  const setPhaseFilter = (next: PhaseFilter): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") {
      params.delete("phase");
    } else {
      params.set("phase", next);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtered = React.useMemo(() => {
    const rows = clubsQuery.data ?? [];
    return rows.filter((club) => {
      if (phaseFilter !== "all" && club.lifecyclePhase !== phaseFilter) {
        return false;
      }
      return matchesSearch(club, search);
    });
  }, [clubsQuery.data, phaseFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "all" as const, label: "All" },
              { key: "in_design" as const, label: "In design" },
              { key: "live" as const, label: "Live" },
            ] as const
          ).map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={phaseFilter === key ? "default" : "outline"}
              onClick={() => setPhaseFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="w-full sm:w-72">
          <label htmlFor="club-search" className="sr-only">
            Search clubs
          </label>
          <Input
            id="club-search"
            placeholder="Search name, slug, description…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {clubsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading clubs…</p>
      ) : null}
      {clubsQuery.error ? (
        <p className="text-sm text-destructive">{(clubsQuery.error as Error).message}</p>
      ) : null}

      {filtered.length === 0 && !clubsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">No clubs match these filters.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((club) => (
            <li key={club.id}>
              <ClubThumbnailCard club={club} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
