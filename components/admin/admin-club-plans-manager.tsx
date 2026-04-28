"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Plan = {
  id: string;
  name: string;
  interval: "month" | "year";
  amountCents: number;
  currency: string;
  isActive: boolean;
};

export function AdminClubPlansManager({ clubId }: { clubId: string }): React.JSX.Element {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [interval, setInterval] = React.useState<"month" | "year">("month");
  const [amountCents, setAmountCents] = React.useState("1000");
  const [currency, setCurrency] = React.useState("usd");
  const [message, setMessage] = React.useState("");

  const plansQuery = useQuery({
    queryKey: ["admin-club-plans", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/clubs/${clubId}/plans`);
      const payload = (await response.json()) as { plans?: Plan[]; error?: string };
      if (!response.ok || !payload.plans) {
        throw new Error(payload.error ?? "Failed to load plans.");
      }
      return payload.plans;
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/clubs/${clubId}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          interval,
          amountCents: Number(amountCents),
          currency,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to create plan.");
      }
    },
    onSuccess: async () => {
      setMessage("Plan created.");
      setName("");
      await queryClient.invalidateQueries({ queryKey: ["admin-club-plans", clubId] });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const updatePlanStatusMutation = useMutation({
    mutationFn: async (input: { planId: string; isActive: boolean }) => {
      const response = await fetch(`/api/admin/clubs/${clubId}/plans/${input.planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: input.isActive }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to update plan.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-club-plans", clubId] });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Name</Label>
            <Input id="plan-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-interval">Interval</Label>
            <Select
              value={interval}
              onValueChange={(value) => setInterval(value as "month" | "year")}
            >
              <SelectTrigger id="plan-interval">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">month</SelectItem>
                <SelectItem value="year">year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-amount">Amount (cents)</Label>
            <Input
              id="plan-amount"
              value={amountCents}
              onChange={(event) => setAmountCents(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-currency">Currency</Label>
            <Input
              id="plan-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            />
          </div>
          <Button onClick={() => createPlanMutation.mutate()} disabled={createPlanMutation.isPending}>
            {createPlanMutation.isPending ? "Creating..." : "Create plan"}
          </Button>
          {message ? <p className="text-sm text-zinc-700">{message}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing plans</CardTitle>
        </CardHeader>
        <CardContent>
          {plansQuery.isLoading ? <p>Loading plans...</p> : null}
          {plansQuery.error ? (
            <p className="text-sm text-red-600">{(plansQuery.error as Error).message}</p>
          ) : null}
          <ul className="space-y-1 text-sm">
            {(plansQuery.data ?? []).map((plan) => (
              <li
                key={plan.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 p-2"
              >
                <span>
                  {plan.name} - {(plan.amountCents / 100).toFixed(2)}{" "}
                  {plan.currency.toUpperCase()}/{plan.interval} -{" "}
                  <span className="uppercase">{plan.isActive ? "active" : "inactive"}</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updatePlanStatusMutation.mutate({
                      planId: plan.id,
                      isActive: !plan.isActive,
                    })
                  }
                >
                  {plan.isActive ? "Disable" : "Enable"}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
