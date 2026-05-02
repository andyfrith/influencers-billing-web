"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { ClubDetailKineticView } from "@/components/clubs/club-detail-kinetic-view";

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
    mutationFn: async (planIdOverride?: string) => {
      const detail = detailQuery.data;
      if (!detail?.club.id) {
        throw new Error("Club not loaded.");
      }
      const effectivePlanId =
        planIdOverride ?? (selectedPlanId || detail.plans[0]?.id);
      if (!effectivePlanId) {
        throw new Error("Select a plan.");
      }

      const response = await fetch(`/api/clubs/${detail.club.id}/subscribe`, {
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
      await queryClient.invalidateQueries({ queryKey: ["club-detail", slug] });
    },
    onError: (error: Error) => {
      setResultMessage(error.message);
    },
  });

  if (detailQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background text-muted-foreground">
        Loading club…
      </div>
    );
  }
  if (detailQuery.error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background px-6 text-sm text-form-error-text">
        {(detailQuery.error as Error).message}
      </div>
    );
  }

  const detail = detailQuery.data;
  if (!detail) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background text-muted-foreground">
        Club not found.
      </div>
    );
  }

  const effectivePlanId = selectedPlanId || detail.plans[0]?.id || "";

  return (
    <ClubDetailKineticView
      club={detail.club}
      plans={detail.plans}
      members={detail.members}
      selectedPlanId={effectivePlanId}
      subscribePending={subscribeMutation.isPending}
      resultMessage={resultMessage}
      onSelectPlan={setSelectedPlanId}
      onJoinPlan={(planId) => {
        setSelectedPlanId(planId);
        subscribeMutation.mutate(planId);
      }}
    />
  );
}
