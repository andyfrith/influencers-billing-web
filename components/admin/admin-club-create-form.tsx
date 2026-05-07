"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function slugifyClubName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * Create-club form; used on `/admin/clubs/new`. Redirects to the new club overview on success.
 */
export function AdminClubCreateForm(): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [contextMarkdown, setContextMarkdown] = React.useState("");
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const createClubMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, contextMarkdown }),
      });
      const payload = (await response.json()) as { error?: string; club?: { id: string } };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to create club.");
      }
      if (!payload.club?.id) {
        throw new Error("Invalid response from server.");
      }
      return payload.club;
    },
    onSuccess: async (club) => {
      setMessage("Club created.");
      setName("");
      setSlug("");
      setDescription("");
      setContextMarkdown("");
      setSlugEdited(false);
      await queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      router.push(`/admin/clubs/${club.id}`);
    },
    onError: (error: Error) => setMessage(error.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create club</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="club-name">Name</Label>
          <Input
            id="club-name"
            value={name}
            onChange={(event) => {
              const nextName = event.target.value;
              setName(nextName);
              if (!slugEdited) {
                setSlug(slugifyClubName(nextName));
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="club-slug">Slug</Label>
          <Input
            id="club-slug"
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="club-description">Description</Label>
          <Input
            id="club-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="club-context-markdown">Purpose / context (Markdown)</Label>
          <textarea
            id="club-context-markdown"
            className="min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder={"# Club purpose\n\nWho this club is for, goals, audience, and design/content direction..."}
            value={contextMarkdown}
            onChange={(event) => setContextMarkdown(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This markdown brief can be used later as your DESIGN.md-style source context.
          </p>
        </div>
        <Button onClick={() => createClubMutation.mutate()} disabled={createClubMutation.isPending}>
          {createClubMutation.isPending ? "Creating…" : "Create club"}
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
