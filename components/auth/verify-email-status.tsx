"use client";

import Link from "next/link";
import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function VerifyEmailStatus({ token }: { token: string }): React.JSX.Element {
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = React.useState<string>("Verifying your email...");

  React.useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Invalid or expired verification link.");
        return;
      }

      setStatus("success");
      setMessage(payload.message ?? "Email verified.");
    };

    run().catch(() => {
      setStatus("error");
      setMessage("Unable to verify email.");
    });
  }, [token]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
        <CardDescription>
          {status === "loading" ? "Please wait..." : "Verification complete."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          {message}
        </p>
        <Link href="/sign-in" className="text-sm font-medium text-foreground">
          Go to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
