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
    <div className="min-h-screen w-full bg-[#0e0b0a] text-[#f2ece8]">
      <header className="border-b border-[#2b221f] bg-[#110d0c]">
        <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-5 lg:px-6">
          <Link href="/" className="text-xl font-bold leading-none tracking-tight text-[#ff8a1d]">
            VANGUARD CLUB
          </Link>
          <nav className="hidden items-center gap-10 text-sm text-[#b7a9a0] md:flex">
            <Link href="/account/memberships" className="hover:text-white">
              Benefits
            </Link>
            <Link href="/clubs" className="hover:text-white">
              Experiences
            </Link>
            <Link href="/account/billing" className="hover:text-white">
              Concierge
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/sign-in" className="text-[#c1b3aa] hover:text-white">
              Log In
            </Link>
            <Button className="h-8 rounded-full bg-[#ff890f] px-4 text-sm font-semibold text-[#2a1300] hover:bg-[#ffa341]">
              Join Now
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-56px-88px)] w-full max-w-[1400px] grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <section className="group relative min-h-[360px] overflow-hidden lg:min-h-0">
          <div
            className="absolute inset-0 bg-cover bg-left transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            style={{
              backgroundImage: "url('/images/vanguard-vip-signup-reference.png')",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(130,95,255,0.00)_0px,rgba(130,95,255,0.00)_8px,rgba(130,95,255,0.09)_9px,rgba(130,95,255,0.00)_10px)] opacity-25 transition-opacity duration-500 group-hover:opacity-55" />
          <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-[#b05fff]/20 blur-3xl transition-all duration-700 group-hover:left-8 group-hover:top-1/4 group-hover:bg-[#c86fff]/35 group-hover:blur-[86px]" />
          <div className="pointer-events-none absolute -right-28 bottom-10 h-56 w-56 rounded-full bg-[#ff7a00]/10 blur-3xl transition-all duration-700 group-hover:right-6 group-hover:bg-[#ff7a00]/20 group-hover:blur-[80px]" />
          <div className="pointer-events-none absolute -left-40 top-0 h-full w-40 rotate-12 bg-linear-to-r from-[#8a59ff00] via-[#b56fff80] to-[#8a59ff00] opacity-0 blur-2xl transition-all duration-700 group-hover:left-[55%] group-hover:opacity-90" />
          <div className="absolute inset-0 bg-linear-to-r from-[#120e0ca8] via-[#1b13155e] to-[#0f0b0bc9]" />
          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-32 bg-linear-to-r from-[#0f0b0b00] to-[#0f0b0b] lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0d0a09de] via-transparent to-transparent" />
          <div className="relative flex h-full items-end p-6 lg:p-10">
            <div className="max-w-md pb-2 lg:pb-4">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-9 bg-[#ff8a1d]" />
                <p className="text-xs uppercase tracking-[0.2em] text-[#dfc8ba]">
                  The Vanguard Standard
                </p>
              </div>
              <h2 className="text-3xl font-semibold leading-tight text-[#f6ede8] lg:text-4xl">
                Access the Unattainable.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#d8c4b8] lg:text-xl">
                Membership is more than a status; it&apos;s a gateway to the world&apos;s most
                curated experiences and private circles.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex items-start justify-center border-t border-[#2b221f] bg-[#0f0b0a] px-6 py-12 sm:px-10 lg:border-t-0 lg:bg-[#0f0b0af0] lg:px-14 lg:pt-24">
          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-24 bg-linear-to-r from-[#0f0b0b00] to-[#0f0b0af0] lg:block" />
          <div className="w-full max-w-[500px]">
            <h1 className="text-3xl font-semibold leading-tight text-[#f4ece8]">
              Claim Your Place in the Vanguard
            </h1>
            <p className="mt-3 text-lg leading-normal text-[#c9b6ab]">
              Welcome to a world of curated excellence. Your membership starts with this step.
            </p>

            <form className="mt-10 space-y-6" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="full-name" className="mb-2 block text-sm text-[#d6c7bd]">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  autoComplete="name"
                  placeholder="Alexander Vanguard"
                  className="h-11 rounded-xl border-[#5a4136] bg-[#2a2421]/90 text-[#f2e8e3] placeholder:text-[#8d786d]"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block text-sm text-[#d6c7bd]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  autoComplete="email"
                  placeholder="alex@vanguard.club"
                  className="h-11 rounded-xl border-[#5a4136] bg-[#2a2421]/90 text-[#f2e8e3] placeholder:text-[#8d786d]"
                  {...form.register("email")}
                />
                <p className="text-xs text-[#ffb4ab]">{form.formState.errors.email?.message}</p>
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 block text-sm text-[#d6c7bd]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-[#5a4136] bg-[#2a2421]/90 pr-11 text-[#f2e8e3] placeholder:text-[#8d786d]"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a88f82] transition-colors hover:text-[#ffd1b0]"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-base">
                      {passwordVisible ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-[#ffb4ab]">{form.formState.errors.password?.message}</p>
              </div>

              {formError ? <p className="text-sm text-[#ffb4ab]">{formError}</p> : null}
              {formMessage ? <p className="text-sm text-[#cec5bf]">{formMessage}</p> : null}

              <Button
                className="mt-3 h-12 w-full rounded-xl bg-[#ff890f] text-lg font-semibold text-[#351000] hover:bg-[#ffa341]"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating account..." : "Join the Vanguard"}
                <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
              </Button>
            </form>

            <p className="mt-7 text-center text-base text-[#c9b6ab]">
              Already have an account?{" "}
              <Link className="font-semibold text-[#ffb77a] hover:text-[#ffd1b0]" href="/sign-in">
                Log In
              </Link>
            </p>

            <div className="mt-10 flex items-center gap-4 text-[#6d5a50]">
              <span className="h-px flex-1 bg-[#3b2f28]" />
              <span className="text-xs uppercase tracking-[0.24em]">Tier One</span>
              <span className="h-px flex-1 bg-[#3b2f28]" />
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#2b221f] bg-[#0f0b0a] py-7">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-5 text-[#8f7f75] md:flex-row md:items-center md:justify-between lg:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ff8a1d]">Vanguard Club</p>
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
