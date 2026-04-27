"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Club = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export function AdminClubsManager(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [message, setMessage] = React.useState("");

  const clubsQuery = useQuery({
    queryKey: ["admin-clubs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/clubs");
      const payload = (await response.json()) as { clubs?: Club[]; error?: string };
      if (!response.ok || !payload.clubs) {
        throw new Error(payload.error ?? "Failed to load clubs.");
      }
      return payload.clubs;
    },
  });

  const createClubMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to create club.");
      }
    },
    onSuccess: async () => {
      setMessage("Club created.");
      setName("");
      setSlug("");
      setDescription("");
      await queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create club</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="club-name">Name</Label>
            <Input id="club-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="club-slug">Slug</Label>
            <Input id="club-slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="club-description">Description</Label>
            <Input
              id="club-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <Button onClick={() => createClubMutation.mutate()} disabled={createClubMutation.isPending}>
            {createClubMutation.isPending ? "Creating..." : "Create club"}
          </Button>
          {message ? <p className="text-sm text-zinc-700">{message}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing clubs</CardTitle>
        </CardHeader>
        <CardContent>
          {clubsQuery.isLoading ? <p>Loading clubs...</p> : null}
          {clubsQuery.error ? (
            <p className="text-sm text-red-600">{(clubsQuery.error as Error).message}</p>
          ) : null}
          <ul className="space-y-1 text-sm">
            {(clubsQuery.data ?? []).map((club) => (
              <li key={club.id}>
                {club.name} ({club.slug})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
