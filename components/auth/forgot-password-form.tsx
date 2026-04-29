"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetSchema } from "@/lib/validators/auth";

type ForgotPasswordValues = z.infer<typeof requestPasswordResetSchema>;

export function ForgotPasswordForm(): React.JSX.Element {
  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    setMessage("");

    const response = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Request failed.");
      return;
    }

    setMessage(payload.message ?? "If your account exists, check your email.");
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Request a password reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" autoComplete="email" {...form.register("email")} />
            <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-foreground">{message}</p> : null}

          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Requesting..." : "Request reset"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Back to{" "}
          <Link href="/sign-in" className="font-medium text-foreground">
            sign in
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
