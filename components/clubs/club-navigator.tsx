"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ClubPlan = {
  id: string;
  name: string;
  interval: "month" | "year";
  amountCents: number;
  currency: string;
};

type Club = {
  id: string;
  name: string;
  slug: string;
  description: string;
  plans: ClubPlan[];
};

/**
 * Data-driven club navigator that routes directly to club detail pages.
 */
export function ClubNavigator(): React.JSX.Element {
  const clubsQuery = useQuery({
    queryKey: ["clubs"],
    queryFn: async (): Promise<Club[]> => {
      const response = await fetch("/api/clubs");
      const payload = (await response.json()) as {
        clubs?: Club[];
        error?: string;
      };

      if (!response.ok || !payload.clubs) {
        throw new Error(payload.error ?? "Failed to load clubs.");
      }

      return payload.clubs;
    },
  });

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#eae1dd]">Discover your club</h1>
        <p className="text-sm text-[#e2bfb0]">Select a club to open its detail page.</p>
      </div>

      {clubsQuery.isLoading ? <p className="text-sm text-stone-400">Loading clubs...</p> : null}
      {clubsQuery.error ? (
        <p className="text-sm text-red-400">{(clubsQuery.error as Error).message}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(clubsQuery.data ?? []).map((club) => (
          <Link key={club.id} href={`/clubs/${club.slug}`} className="group block">
            <Card className="h-full border-stone-800/70 bg-stone-900/70 transition-colors duration-200 group-hover:border-orange-500/70">
              <CardHeader>
                <CardTitle className="text-[#eae1dd] group-hover:text-orange-400">{club.name}</CardTitle>
                <CardDescription className="text-[#d6b8ac]">{club.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-stone-400">Plans</p>
                <p className="text-sm text-stone-300">
                  {club.plans.length > 0
                    ? club.plans
                        .map(
                          (plan) =>
                            `${plan.name} (${(plan.amountCents / 100).toFixed(2)} ${plan.currency.toUpperCase()}/${plan.interval})`,
                        )
                        .join(", ")
                    : "No active plans"}
                </p>
                <p className="pt-2 text-sm font-medium text-orange-400">Open club details</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
