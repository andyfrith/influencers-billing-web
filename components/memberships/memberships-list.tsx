"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Membership = {
  membershipId: string;
  status: string;
  currentPeriodEnd: string | null;
  clubName: string;
  clubSlug: string;
  planName: string;
  interval: string;
  amountCents: number;
  currency: string;
};

export function MembershipsList(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [reasonByMembership, setReasonByMembership] = React.useState<Record<string, string>>({});

  const membershipsQuery = useQuery({
    queryKey: ["memberships"],
    queryFn: async () => {
      const response = await fetch("/api/memberships");
      const payload = (await response.json()) as { memberships?: Membership[]; error?: string };
      if (!response.ok || !payload.memberships) {
        throw new Error(payload.error ?? "Failed to load memberships.");
      }
      return payload.memberships;
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const reason = reasonByMembership[membershipId] ?? "";
      const response = await fetch(`/api/memberships/${membershipId}/cancel-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to request cancellation.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });

  if (membershipsQuery.isLoading) {
    return <p>Loading memberships...</p>;
  }
  if (membershipsQuery.error) {
    return <p className="text-sm text-red-600">{(membershipsQuery.error as Error).message}</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My memberships</h1>
      {(membershipsQuery.data ?? []).map((membership) => (
        <Card key={membership.membershipId}>
          <CardHeader>
            <CardTitle>{membership.clubName}</CardTitle>
            <CardDescription>
              {membership.planName} - {(membership.amountCents / 100).toFixed(2)}{" "}
              {membership.currency.toUpperCase()}/{membership.interval}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-zinc-700">Status: {membership.status}</p>
            <div className="space-y-2">
              <Label htmlFor={`reason-${membership.membershipId}`}>
                Reason for cancellation request
              </Label>
              <Input
                id={`reason-${membership.membershipId}`}
                placeholder="Please share why you want to cancel."
                value={reasonByMembership[membership.membershipId] ?? ""}
                onChange={(event) => {
                  setReasonByMembership((currentValue) => ({
                    ...currentValue,
                    [membership.membershipId]: event.target.value,
                  }));
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => cancelRequestMutation.mutate(membership.membershipId)}
              disabled={cancelRequestMutation.isPending}
            >
              {cancelRequestMutation.isPending
                ? "Submitting request..."
                : "Request cancellation"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
