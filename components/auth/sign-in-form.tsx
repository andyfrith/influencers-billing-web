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

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string>("");
  const [keepSignedIn, setKeepSignedIn] = React.useState<boolean>(false);
  const [heroParallax, setHeroParallax] = React.useState<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [neonFlickerLevel, setNeonFlickerLevel] = React.useState<number>(0.25);
  const neonTimeoutsRef = React.useRef<number[]>([]);

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

  /**
   * Runs a short electric-style flicker sequence.
   */
  const triggerNeonFlicker = React.useCallback(() => {
    neonTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId),
    );
    neonTimeoutsRef.current = [];

    const flickerFrames: Array<{ delayMs: number; level: number }> = [
      { delayMs: 0, level: 1 },
      { delayMs: 55, level: 0.16 },
      { delayMs: 110, level: 0.92 },
      { delayMs: 180, level: 0.34 },
      { delayMs: 260, level: 0.98 },
      { delayMs: 360, level: 0.52 },
      { delayMs: 520, level: 0.76 },
      { delayMs: 760, level: 0.36 },
    ];

    flickerFrames.forEach(({ delayMs, level }) => {
      const timeoutId = window.setTimeout(() => {
        setNeonFlickerLevel(level);
      }, delayMs);
      neonTimeoutsRef.current.push(timeoutId);
    });
  }, []);

  React.useEffect(() => {
    triggerNeonFlicker();
    return () => {
      neonTimeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      neonTimeoutsRef.current = [];
    };
  }, [triggerNeonFlicker]);

  /**
   * Tracks pointer movement to create a subtle hover parallax effect.
   */
  const handleHeroPointerMove = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      setHeroParallax({
        x: normalizedX,
        y: normalizedY,
        active: true,
      });
    },
    [],
  );

  /**
   * Triggers a short neon bloom whenever hover starts.
   */
  const handleHeroPointerEnter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      handleHeroPointerMove(event);
      triggerNeonFlicker();
    },
    [handleHeroPointerMove, triggerNeonFlicker],
  );

  /**
   * Resets image animation when pointer exits the hero section.
   */
  const handleHeroPointerLeave = React.useCallback(() => {
    setHeroParallax({
      x: 0,
      y: 0,
      active: false,
    });
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full bg-[#0b0807] text-[#efe7e2]">
      <main className="grid min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <section
          className="relative hidden overflow-hidden md:block"
          onMouseMove={handleHeroPointerMove}
          onMouseEnter={handleHeroPointerEnter}
          onMouseLeave={handleHeroPointerLeave}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOtYVMup0fIb8SNQAwKD6Oa7otj0IhLGYpl1mRY9_BJQ06D4NJjVJPljrZYNxOiJJJGsWYgbq_4Ep8igjEWyrNum1CBZt3YD-9Qlm-siDh18npP8AZ2CytyprrUjzDFXIMRqKdXalk6vyE70NlL3cMX4gflO9E9rAhG6U7-YQXOYREHIi8b5CavjWIW-mHFbsTRzuImgA81OkSqnO1EnO0P2U_6SuRmNFU3VjpUIsYJMazGx3ge30HjaEdHEYNjq7ymps_pM0H2rNd')",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOtYVMup0fIb8SNQAwKD6Oa7otj0IhLGYpl1mRY9_BJQ06D4NJjVJPljrZYNxOiJJJGsWYgbq_4Ep8igjEWyrNum1CBZt3YD-9Qlm-siDh18npP8AZ2CytyprrUjzDFXIMRqKdXalk6vyE70NlL3cMX4gflO9E9rAhG6U7-YQXOYREHIi8b5CavjWIW-mHFbsTRzuImgA81OkSqnO1EnO0P2U_6SuRmNFU3VjpUIsYJMazGx3ge30HjaEdHEYNjq7ymps_pM0H2rNd')",
              transform: `translate3d(${heroParallax.x * 8}px, ${heroParallax.y * 8}px, 0) scale(${heroParallax.active ? 1.015 : 1})`,
              clipPath: "ellipse(18% 29% at 39% 52%)",
              filter: "saturate(1.08) contrast(1.03)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOtYVMup0fIb8SNQAwKD6Oa7otj0IhLGYpl1mRY9_BJQ06D4NJjVJPljrZYNxOiJJJGsWYgbq_4Ep8igjEWyrNum1CBZt3YD-9Qlm-siDh18npP8AZ2CytyprrUjzDFXIMRqKdXalk6vyE70NlL3cMX4gflO9E9rAhG6U7-YQXOYREHIi8b5CavjWIW-mHFbsTRzuImgA81OkSqnO1EnO0P2U_6SuRmNFU3VjpUIsYJMazGx3ge30HjaEdHEYNjq7ymps_pM0H2rNd')",
              transform: `translate3d(${heroParallax.x * 6}px, ${heroParallax.y * 6}px, 0) scale(${heroParallax.active ? 1.01 : 1})`,
              clipPath: "ellipse(13% 17% at 39% 33%)",
              filter: "saturate(1.12) contrast(1.05)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(420px circle at 52% 45%, rgba(0, 255, 255, 0.14), transparent 62%), radial-gradient(540px circle at 58% 52%, rgba(255, 0, 168, 0.12), transparent 68%)",
              transform: `translate3d(${heroParallax.x * -8}px, ${heroParallax.y * -8}px, 0)`,
              opacity: heroParallax.active ? 0.95 : 0.7,
              mixBlendMode: "screen",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 transition-all duration-500"
            style={{
              background:
                "radial-gradient(180px circle at 70% 30%, rgba(255, 106, 0, 0.38), transparent 72%), radial-gradient(240px circle at 17% 58%, rgba(0, 246, 255, 0.34), transparent 75%), radial-gradient(200px circle at 80% 66%, rgba(255, 0, 168, 0.28), transparent 78%)",
              opacity:
                0.22 + neonFlickerLevel * (heroParallax.active ? 0.78 : 0.66),
              filter: `blur(${12 + neonFlickerLevel * 13}px) saturate(${1.08 + neonFlickerLevel * 0.24})`,
              mixBlendMode: "screen",
              transform: `translate3d(${heroParallax.x * -6}px, ${heroParallax.y * -6}px, 0) scale(${1 + neonFlickerLevel * 0.06})`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0f0d0c]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-r from-[#0f0d0c00] via-[#0f0d0c88] to-[#0f0d0c]" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0f0d0ce6] via-[#0f0d0c33] to-transparent" />
          <div className="relative flex h-full items-end p-16">
            <div className="max-w-md">
              <h2 className="text-5xl font-semibold leading-tight text-[#eae1dd]">
                The Pinnacle of Private Membership.
              </h2>
              <p className="mt-5 text-2xl leading-snug text-[#e2bfb0cc]">
                Experience the intersection of high-technology and exclusive
                luxury.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-[#0f0d0c] p-8 md:p-24">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-semibold leading-tight text-[#eae1dd] md:text-[2rem]">
              Welcome Back
            </h1>
            <p className="mt-2 text-base text-[#e2bfb0]">
              Please enter your credentials to access the club.
            </p>

            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#e2bfb0]"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  autoComplete="email"
                  placeholder="name@vanguard.club"
                  className="h-12 rounded-xl border-[#2d2824] bg-[#1a1614] px-4 text-base text-[#eae1dd] placeholder:text-stone-600"
                  {...form.register("email")}
                />
                <p className="mt-1 text-sm text-[#ffb4ab]">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#e2bfb0]"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#ff6b00] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-[#2d2824] bg-[#1a1614] px-4 text-base text-[#eae1dd] placeholder:text-stone-600"
                  {...form.register("password")}
                />
                <p className="mt-1 text-sm text-[#ffb4ab]">
                  {form.formState.errors.password?.message}
                </p>
              </div>

              <label className="flex items-center gap-2 py-1 text-xs tracking-[0.02em] text-[#e2bfb0]">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(event) => setKeepSignedIn(event.target.checked)}
                  className="h-4 w-4 rounded border-[#2d2824] bg-[#1a1614] accent-[#ff6b00]"
                />
                Keep me logged in for 30 days
              </label>

              {formError ? (
                <p className="text-base text-[#ffb4ab]">{formError}</p>
              ) : null}

              <Button
                className="h-14 w-full rounded-xl bg-[#ff6b00] text-2xl font-semibold text-[#561f00] shadow-lg shadow-[#ff6b00]/20 hover:brightness-110"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing In..." : "Login"}
              </Button>
            </form>

            <p className="mt-8 text-center text-base text-[#e2bfb0]">
              Don&apos;t have an account?{" "}
              <Link
                className="font-semibold text-[#ff6b00] hover:underline"
                href="/sign-up"
              >
                Apply for Membership
              </Link>
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-[#2d2824] bg-[#1a1614] px-4 py-3 text-[#e2bfb0]">
                <span className="material-symbols-outlined text-[#ff6b00]">
                  verified_user
                </span>
                <span className="text-xs">Encrypted Access</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#2d2824] bg-[#1a1614] px-4 py-3 text-[#e2bfb0]">
                <span className="material-symbols-outlined text-[#ff6b00]">
                  support_agent
                </span>
                <span className="text-xs">VIP Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0f0d0c] py-7">
        <div className="flex w-full flex-col items-start gap-4 px-6 text-[10px] uppercase tracking-[0.2em] text-stone-600 md:flex-row md:items-center md:justify-between md:px-12">
          <span>© 2024 VANGUARD CLUB. PRESTIGE DEFINED.</span>
          <div className="flex flex-wrap gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>VIP Access</span>
            <span className="text-[#ff6b00]">Concierge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
