"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/lib/validators/auth";
import { LoginContent } from "@/data/club-landing-types";
import Footer from "@/components/clubs/template/footer";
import { Hero } from "@/components/signIn/clubs/hero";

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  clubName,
  loginContent,
  slug,
}: {
  clubName: string;
  loginContent?: LoginContent | undefined;
  slug: string;
}): React.JSX.Element {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string>("");
  const [keepSignedIn, setKeepSignedIn] = React.useState<boolean>(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "afrith.denver.usa@gmail.com",
      password: "asdfasdf",
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

    router.push(`/discover/clubs/${slug}`);
    router.refresh();
  });

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-surface-void text-foreground">
      <main className="grid min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <Hero
          headline={
            loginContent?.headline ?? "The Pinnacle of Private Membership."
          }
          subheadline={
            loginContent?.subheadline ??
            "Experience the intersection of high-technology and exclusive luxury."
          }
        />

        <section className="relative flex items-center justify-center bg-surface-deepest p-8 md:p-24">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-semibold leading-tight text-foreground md:text-[2rem]">
              {loginContent?.form?.headline ?? "Welcome Back"}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Please enter your credentials to access the club.
            </p>

            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  autoComplete="email"
                  placeholder="name@vanguard.club"
                  className="h-12 rounded-xl border-border-subtle bg-surface-panel px-4 text-base text-foreground placeholder:text-muted-foreground/50"
                  {...form.register("email")}
                />
                <p className="mt-1 text-sm text-form-error-text">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-border-subtle bg-surface-panel px-4 text-base text-foreground placeholder:text-muted-foreground/50"
                  {...form.register("password")}
                />
                <p className="mt-1 text-sm text-form-error-text">
                  {form.formState.errors.password?.message}
                </p>
              </div>

              <label className="flex items-center gap-2 py-1 text-xs tracking-[0.02em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(event) => setKeepSignedIn(event.target.checked)}
                  className="h-4 w-4 rounded border-border-subtle bg-surface-panel accent-primary"
                />
                Keep me logged in for 30 days
              </label>

              {formError ? (
                <p className="text-base text-form-error-text">{formError}</p>
              ) : null}

              <Button
                className="h-14 w-full rounded-xl bg-primary text-2xl font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Signing In..."
                  : (loginContent?.form?.submitButtonLabel ?? "Sign In")}
              </Button>
            </form>

            <p className="mt-8 text-center text-base text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                className="font-semibold text-primary hover:underline"
                href="/sign-up"
              >
                Apply for Membership
              </Link>
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-panel px-4 py-3 text-muted-foreground">
                <span className="material-symbols-outlined text-primary">
                  verified_user
                </span>
                <span className="text-xs">Encrypted Access</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-panel px-4 py-3 text-muted-foreground">
                <span className="material-symbols-outlined text-primary">
                  support_agent
                </span>
                <span className="text-xs">VIP Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer clubName={clubName} />
    </div>
  );
}
