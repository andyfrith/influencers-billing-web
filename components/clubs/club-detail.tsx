"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClubDetailProps = {
  slug: string;
};

type ClubPlan = {
  id: string;
  name: string;
  interval: "month" | "year";
  amountCents: number;
  currency: string;
};

type ClubMember = {
  userId: string;
  email: string;
  status: string;
};

type ClubDetailResponse = {
  club: {
    id: string;
    name: string;
    description: string;
  };
  plans: ClubPlan[];
  members: ClubMember[];
};

export function ClubDetail({ slug }: ClubDetailProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>("");
  const [resultMessage, setResultMessage] = React.useState<string>("");

  const detailQuery = useQuery({
    queryKey: ["club-detail", slug],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/slug/${slug}`);
      const payload = (await response.json()) as ClubDetailResponse & { error?: string };
      if (!response.ok || !payload.club) {
        throw new Error(payload.error ?? "Failed to load club.");
      }
      return payload;
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const effectivePlanId = selectedPlanId || detailQuery.data?.plans[0]?.id;
      if (!effectivePlanId) {
        throw new Error("Select a plan.");
      }

      const response = await fetch(`/api/clubs/${detailQuery.data?.club.id}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: effectivePlanId }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to subscribe.");
      }
      return payload.message ?? "Subscribed successfully.";
    },
    onSuccess: async (message) => {
      setResultMessage(message);
      await queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
    onError: (error: Error) => {
      setResultMessage(error.message);
    },
  });

  if (detailQuery.isLoading) {
    return <p>Loading club...</p>;
  }
  if (detailQuery.error) {
    return <p className="text-sm text-red-600">{(detailQuery.error as Error).message}</p>;
  }

  const detail = detailQuery.data;
  if (!detail) {
    return <p>Club not found.</p>;
  }
  const effectivePlanId = selectedPlanId || detail.plans[0]?.id || "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{detail.club.name}</CardTitle>
          <CardDescription>{detail.club.description}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscribe</CardTitle>
          <CardDescription>Select a plan to join this club.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.plans.length === 0 ? (
            <p className="text-sm text-zinc-600">No active plans available.</p>
          ) : (
            <>
              <Select value={effectivePlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                {detail.plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {(plan.amountCents / 100).toFixed(2)}{" "}
                    {plan.currency.toUpperCase()}/{plan.interval}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  subscribeMutation.mutate();
                }}
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Join club"}
              </Button>
            </>
          )}
          {resultMessage ? <p className="text-sm text-zinc-700">{resultMessage}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Current club members.</CardDescription>
        </CardHeader>
        <CardContent>
          {detail.members.length === 0 ? (
            <p className="text-sm text-zinc-600">No members yet.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {detail.members.map((member) => (
                <li key={member.userId}>
                  {member.email} ({member.status})
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
