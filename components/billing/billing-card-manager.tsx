"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBillingUiStore } from "@/stores/billing-ui-store";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

type PaymentMethodSummary = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
} | null;

const noFieldsSchema = z.object({});

function PaymentMethodForm(): React.JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const { isEditingCard, setEditingCard } = useBillingUiStore();
  const [formError, setFormError] = React.useState("");

  const setupIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/billing/setup-intent", { method: "POST" });
      const payload = (await response.json()) as {
        clientSecret?: string;
        error?: string;
      };

      if (!response.ok || !payload.clientSecret) {
        throw new Error(payload.error ?? "Unable to initialize card setup.");
      }

      return payload.clientSecret;
    },
  });

  const saveCardMutation = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements) {
        throw new Error("Stripe is still loading.");
      }

      const clientSecret = await setupIntentMutation.mutateAsync();
      const card = elements.getElement(CardElement);

      if (!card) {
        throw new Error("Card input is not available.");
      }

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error || !result.setupIntent?.payment_method) {
        throw new Error(result.error?.message ?? "Failed to save card.");
      }

      const saveResponse = await fetch("/api/billing/payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: result.setupIntent.payment_method }),
      });

      const savePayload = (await saveResponse.json()) as { error?: string };
      if (!saveResponse.ok) {
        throw new Error(savePayload.error ?? "Failed to finalize card save.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["payment-method"] });
      setEditingCard(false);
      setFormError("");
    },
    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  const removeCardMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/billing/payment-method", { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to remove card.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["payment-method"] });
      setEditingCard(false);
      setFormError("");
    },
    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  const form = useForm<z.infer<typeof noFieldsSchema>>({
    resolver: zodResolver(noFieldsSchema),
  });

  const onSubmit = form.handleSubmit(async () => {
    await saveCardMutation.mutateAsync();
  });

  if (!isEditingCard) {
    return (
      <Button
        onClick={() => {
          setEditingCard(true);
        }}
      >
        Add or update card
      </Button>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="rounded-md border border-zinc-300 p-3">
        <CardElement />
      </div>
      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={saveCardMutation.isPending || !stripe || !elements}
        >
          {saveCardMutation.isPending ? "Saving..." : "Save card"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditingCard(false)}
          disabled={saveCardMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            removeCardMutation.mutate();
          }}
          disabled={removeCardMutation.isPending}
        >
          {removeCardMutation.isPending ? "Removing..." : "Remove current card"}
        </Button>
      </div>
    </form>
  );
}

export function BillingCardManager(): React.JSX.Element {
  const paymentMethodQuery = useQuery({
    queryKey: ["payment-method"],
    queryFn: async () => {
      const response = await fetch("/api/billing/payment-method");
      const payload = (await response.json()) as {
        paymentMethod?: PaymentMethodSummary;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load payment method.");
      }

      return payload.paymentMethod ?? null;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>
          Card details are collected securely using Stripe Elements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {paymentMethodQuery.isLoading ? (
          <p className="text-sm text-zinc-600">Loading billing data...</p>
        ) : paymentMethodQuery.error ? (
          <p className="text-sm text-red-600">
            {(paymentMethodQuery.error as Error).message}
          </p>
        ) : paymentMethodQuery.data ? (
          <div className="rounded-md border border-zinc-200 p-4">
            <p className="text-sm text-zinc-700">
              {paymentMethodQuery.data.brand.toUpperCase()} ending in{" "}
              {paymentMethodQuery.data.last4}
            </p>
            <p className="text-xs text-zinc-500">
              Expires {paymentMethodQuery.data.expMonth}/{paymentMethodQuery.data.expYear}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-600">No card saved yet.</p>
        )}

        <Elements stripe={stripePromise}>
          <PaymentMethodForm />
        </Elements>
      </CardContent>
    </Card>
  );
}
