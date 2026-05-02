"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export function ClubsDirectory(): React.JSX.Element {
  const clubsQuery = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
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
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold">Clubs</h1>
        <Link
          className="text-sm font-medium text-primary underline underline-offset-4"
          href="/clubs/navigator"
        >
          Club Navigator — Amber Nocturne (design)
        </Link>
      </div>
      {clubsQuery.isLoading ? <p>Loading clubs...</p> : null}
      {clubsQuery.error ? (
        <p className="text-sm text-destructive">
          {(clubsQuery.error as Error).message}
        </p>
      ) : null}

      {(clubsQuery.data ?? []).map((club) => (
        <Card key={club.id}>
          <CardHeader>
            <CardTitle>{club.name}</CardTitle>
            <CardDescription>{club.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Plans:{" "}
              {club.plans.length > 0
                ? club.plans
                    .map(
                      (plan) =>
                        `${plan.name} (${(plan.amountCents / 100).toFixed(2)} ${plan.currency.toUpperCase()}/${plan.interval})`,
                    )
                    .join(", ")
                : "No active plans"}
            </p>
            <Link
              className="text-sm font-medium underline"
              href={`/clubs/${club.slug}`}
            >
              View club
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
