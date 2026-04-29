"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminBootstrap(): React.JSX.Element {
  const [email, setEmail] = React.useState("");
  const [bootstrapKey, setBootstrapKey] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/bootstrap/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bootstrapKey }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setMessage(payload.error ?? "Failed to promote user.");
        return;
      }
      setMessage(payload.message ?? "User promoted.");
    } catch {
      setMessage("Failed to promote user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bootstrap admin access</CardTitle>
        <CardDescription>
          Promote an existing user to admin using `ADMIN_BOOTSTRAP_KEY`.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="bootstrap-email">User email</Label>
          <Input
            id="bootstrap-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bootstrap-key">Bootstrap key</Label>
          <Input
            id="bootstrap-key"
            type="password"
            value={bootstrapKey}
            onChange={(event) => setBootstrapKey(event.target.value)}
          />
        </div>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Promoting..." : "Promote to admin"}
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
