"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema } from "@/lib/validators/auth";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm(): React.JSX.Element {
  const [formMessage, setFormMessage] = React.useState<string>("");
  const [formError, setFormError] = React.useState<string>("");
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError("");
    setFormMessage("");

    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setFormError(payload.error ?? "Unable to create account.");
      return;
    }

    setFormMessage(payload.message ?? "Account created.");
    form.reset();
  });

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-background text-foreground">
      <div className="grid min-h-0 w-full flex-1 grid-cols-1 lg:min-h-[calc(100dvh-5rem-5.5rem)] lg:grid-cols-[1fr_1fr]">
        <section className="group relative min-h-[360px] overflow-hidden lg:min-h-0">
          <div
            className="absolute inset-0 bg-cover bg-left transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            style={{
              backgroundImage: "url('/images/vanguard-vip-signup-reference.png')",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-primary/5 opacity-25 transition-opacity duration-500 group-hover:opacity-40" />
          <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl transition-all duration-700 group-hover:left-8 group-hover:top-1/4 group-hover:bg-accent/35 group-hover:blur-[86px]" />
          <div className="pointer-events-none absolute -right-28 bottom-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:right-6 group-hover:bg-primary/20 group-hover:blur-[80px]" />
          <div className="pointer-events-none absolute -left-40 top-0 h-full w-40 rotate-12 bg-linear-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 blur-2xl transition-all duration-700 group-hover:left-[55%] group-hover:opacity-90" />
          <div className="absolute inset-0 bg-linear-to-r from-background/70 via-background/40 to-surface-deepest/80" />
          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-32 bg-linear-to-r from-surface-deepest/0 to-surface-deepest lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-surface-deepest/90 via-transparent to-transparent" />
          <div className="relative flex h-full items-end p-6 lg:p-10">
            <div className="max-w-md pb-2 lg:pb-4">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-9 bg-primary" />
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  The Vanguard Standard
                </p>
              </div>
              <h2 className="text-3xl font-semibold leading-tight text-foreground lg:text-4xl">
                Access the Unattainable.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-xl">
                Membership is more than a status; it&apos;s a gateway to the world&apos;s most
                curated experiences and private circles.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex items-start justify-center border-t border-border-subtle bg-surface-deepest px-6 py-12 sm:px-10 lg:border-t-0 lg:bg-surface-deepest/95 lg:px-14 lg:pt-24">
          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-24 bg-linear-to-r from-surface-deepest/0 to-surface-deepest/95 lg:block" />
          <div className="w-full max-w-[500px]">
            <h1 className="text-3xl font-semibold leading-tight text-foreground">
              Claim Your Place in the Vanguard
            </h1>
            <p className="mt-3 text-lg leading-normal text-muted-foreground">
              Welcome to a world of curated excellence. Your membership starts with this step.
            </p>

            <form className="mt-10 space-y-6" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="full-name" className="mb-2 block text-sm text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  autoComplete="name"
                  placeholder="Alexander Vanguard"
                  className="h-11 rounded-xl border-border bg-card/90 text-foreground placeholder:text-muted-foreground/55"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  autoComplete="email"
                  placeholder="alex@vanguard.club"
                  className="h-11 rounded-xl border-border bg-card/90 text-foreground placeholder:text-muted-foreground/55"
                  {...form.register("email")}
                />
                <p className="text-xs text-form-error-text">{form.formState.errors.email?.message}</p>
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 block text-sm text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card/90 pr-11 text-foreground placeholder:text-muted-foreground/55"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-accent"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-base">
                      {passwordVisible ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-form-error-text">{form.formState.errors.password?.message}</p>
              </div>

              {formError ? <p className="text-sm text-form-error-text">{formError}</p> : null}
              {formMessage ? <p className="text-sm text-form-success-note">{formMessage}</p> : null}

              <Button
                className="mt-3 h-12 w-full rounded-xl bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary-hover"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating account..." : "Join the Vanguard"}
                <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
              </Button>
            </form>

            <p className="mt-7 text-center text-base text-muted-foreground">
              Already have an account?{" "}
              <Link className="font-semibold text-secondary hover:text-accent" href="/sign-in">
                Log In
              </Link>
            </p>

            <div className="mt-10 flex items-center gap-4 text-muted-foreground/70">
              <span className="h-px flex-1 bg-border-subtle" />
              <span className="text-xs uppercase tracking-[0.24em]">Tier One</span>
              <span className="h-px flex-1 bg-border-subtle" />
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-border-subtle bg-surface-deepest py-7">
        <div className="flex w-full flex-col gap-4 px-4 text-muted-foreground/80 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Vanguard Club</p>
            <p className="mt-2 text-xs">© 2024 VANGUARD CLUB. THE PINNACLE OF EXCLUSIVITY.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.12em]">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Membership Rules</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
