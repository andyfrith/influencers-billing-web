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
import { resetPasswordSchema } from "@/lib/validators/auth";

type ResetPasswordValues = Pick<z.infer<typeof resetPasswordSchema>, "password">;

export function ResetPasswordForm({ token }: { token: string }): React.JSX.Element {
  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema.pick({ password: true })),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    setMessage("");

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: values.password,
      }),
    });
    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to reset password.");
      return;
    }

    setMessage(payload.message ?? "Password has been reset.");
    form.reset();
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create new password</CardTitle>
        <CardDescription>Set a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            <p className="text-xs text-destructive">{form.formState.errors.password?.message}</p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-foreground">{message}</p> : null}

          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save password"}
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
