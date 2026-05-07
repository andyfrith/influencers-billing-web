"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminClubLifecyclePhase } from "@/lib/admin-club-directory";

type ClubDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  contextMarkdown: string;
  status: "new" | "active" | "archived";
  publishedLandingVariationId: string | null;
  publishedLandingRevisionId: string | null;
  heroPreviewSrc: string | null;
  lifecyclePhase: AdminClubLifecyclePhase;
  createdAt: string;
  updatedAt: string;
};

/**
 * Club overview: metadata, lifecycle, links, archive actions.
 */
export function AdminClubDetail({ clubId }: { clubId: string }): React.JSX.Element {
  const queryClient = useQueryClient();
  const [message, setMessage] = React.useState("");

  const clubQuery = useQuery({
    queryKey: ["admin-club", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/clubs/${clubId}`);
      const payload = (await response.json()) as { club?: ClubDetail; error?: string };
      if (!response.ok || !payload.club) {
        throw new Error(payload.error ?? "Failed to load club.");
      }
      return payload.club;
    },
  });

  const archiveClubMutation = useMutation({
    mutationFn: async (input: { clubId: string; status: "new" | "active" | "archived" }) => {
      const response = await fetch("/api/admin/clubs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to update club.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-club", clubId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  if (clubQuery.isLoading || !clubQuery.data) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-sm text-muted-foreground">
            {clubQuery.isLoading ? "Loading club…" : (clubQuery.error as Error)?.message ?? "Not found."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const club = clubQuery.data;
  const initial = club.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                  club.lifecyclePhase === "live"
                    ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/20 text-amber-800 dark:text-amber-300",
                )}
              >
                {club.lifecyclePhase === "live" ? "Live" : "In design"}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium uppercase text-muted-foreground">
                {club.status}
              </span>
            </div>
            <CardTitle className="text-2xl">{club.name}</CardTitle>
            <p className="font-mono text-sm text-muted-foreground">{club.slug}</p>
            <p className="text-sm text-muted-foreground">{club.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild>
                <Link href={`/admin/clubs/${club.id}/landing`}>Landing page</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/admin/clubs/${club.id}/plans`}>Plans</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/discover/clubs/${club.slug}`}>View discover page</Link>
              </Button>
            </div>
          </CardHeader>
          <div className="relative min-h-[200px] bg-muted md:min-h-full">
            {club.heroPreviewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={club.heroPreviewSrc} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="flex size-full min-h-[200px] items-center justify-center bg-gradient-to-br from-primary/25 via-muted to-muted md:min-h-full">
                <span className="text-5xl font-semibold text-primary/80">{initial}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {club.publishedLandingRevisionId ? (
            <p>
              A landing revision is published for discover. Variation id:{" "}
              <span className="font-mono text-foreground">
                {club.publishedLandingVariationId?.slice(0, 8) ?? "—"}…
              </span>
            </p>
          ) : (
            <p>No published landing revision — discover falls back to legacy JSON or bundled defaults.</p>
          )}
          <p className="text-xs">Updated {new Date(club.updatedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purpose / context brief</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs text-muted-foreground">
            {club.contextMarkdown || "No context markdown provided."}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          {club.status === "active" ? (
            <Button
              variant="outline"
              onClick={() => archiveClubMutation.mutate({ clubId: club.id, status: "archived" })}
              disabled={archiveClubMutation.isPending}
            >
              Archive club
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => archiveClubMutation.mutate({ clubId: club.id, status: "active" })}
              disabled={archiveClubMutation.isPending}
            >
              Re-activate club
            </Button>
          )}
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
