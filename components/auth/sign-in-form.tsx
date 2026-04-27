"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/lib/validators/auth";

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string>("");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError("");
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      setFormError("Invalid credentials or unverified email.");
      return;
    }

    router.push("/account/billing");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Continue to your billing account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" autoComplete="email" {...form.register("email")} />
            <p className="text-xs text-red-600">{form.formState.errors.email?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            <p className="text-xs text-red-600">{form.formState.errors.password?.message}</p>
          </div>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <Link className="font-medium text-zinc-900" href="/sign-up">
            Create account
          </Link>
          <Link className="font-medium text-zinc-900" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Need first-time admin access?{" "}
          <Link className="font-medium text-zinc-900 underline" href="/admin/bootstrap">
            Open admin bootstrap
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
