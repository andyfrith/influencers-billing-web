"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CancellationRequest = {
  id: string;
  status: string;
  reason: string;
  membershipId: string;
  requestedByEmail: string;
};

export function AdminCancellationRequests(): React.JSX.Element {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ["admin-cancel-requests"],
    queryFn: async () => {
      const response = await fetch("/api/admin/cancellation-requests");
      const payload = (await response.json()) as {
        requests?: CancellationRequest[];
        error?: string;
      };
      if (!response.ok || !payload.requests) {
        throw new Error(payload.error ?? "Failed to load requests.");
      }
      return payload.requests;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (input: { id: string; action: "approve" | "reject" | "complete" }) => {
      const response = await fetch(`/api/admin/cancellation-requests/${input.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: input.action }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to resolve request.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-cancel-requests"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancellation requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requestsQuery.isLoading ? <p>Loading requests...</p> : null}
        {requestsQuery.error ? (
          <p className="text-sm text-destructive">{(requestsQuery.error as Error).message}</p>
        ) : null}
        <div className="space-y-3">
          {(requestsQuery.data ?? []).map((request) => (
            <div key={request.id} className="rounded-md border border-border p-3">
              <p className="text-sm">
                <span className="font-medium">{request.requestedByEmail}</span>: {request.reason}
              </p>
              <p className="mb-2 text-xs text-muted-foreground">status: {request.status}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveMutation.mutate({ id: request.id, action: "approve" })}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => resolveMutation.mutate({ id: request.id, action: "reject" })}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => resolveMutation.mutate({ id: request.id, action: "complete" })}
                >
                  Complete cancellation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
