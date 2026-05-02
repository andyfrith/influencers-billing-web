"use client";

import Link from "next/link";
import * as React from "react";

import {
  KINETIC_LAB_AVATAR_IMAGE,
  KINETIC_LAB_EVENT_HIIT_IMAGE,
  KINETIC_LAB_EVENT_YOGA_IMAGE,
  KINETIC_LAB_HERO_IMAGE,
} from "@/components/clubs/kinetic-lab-assets";
import kineticStyles from "@/components/clubs/club-detail-kinetic.module.css";
import { cn } from "@/lib/utils";

type ClubPlan = {
  id: string;
  name: string;
  interval: "month" | "year";
  amountCents: number;
  currency: string;
};

type ClubMember = {
  userId: string;
  email: string;
  status: string;
};

export type ClubDetailKineticViewProps = {
  club: { name: string; description: string };
  plans: ClubPlan[];
  members: ClubMember[];
  selectedPlanId: string;
  subscribePending: boolean;
  resultMessage: string;
  onSelectPlan: (planId: string) => void;
  /** Subscribe using the given plan (avoids stale selected state). */
  onJoinPlan: (planId: string) => void;
};

function MatIcon({
  name,
  className,
  filled,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}): React.JSX.Element {
  return (
    <span
      className={cn("material-symbols-outlined align-middle", className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

/**
 * Stitch-aligned “Club Detail - The Kinetic Lab” layout (dark shell, hero, tiers, events).
 * Static marketing copy and imagery follow the Stitch export; club name, description, plans, and members are live.
 */
export function ClubDetailKineticView({
  club,
  plans,
  members,
  selectedPlanId,
  subscribePending,
  resultMessage,
  onSelectPlan,
  onJoinPlan,
}: ClubDetailKineticViewProps): React.JSX.Element {
  const sortedPlans = React.useMemo(
    () => [...plans].sort((a, b) => a.amountCents - b.amountCents),
    [plans],
  );
  const popularIndex =
    sortedPlans.length >= 3 ? 1 : sortedPlans.length === 2 ? 1 : sortedPlans.length === 1 ? -1 : -1;

  const aboutParagraphs = React.useMemo(() => {
    const text = club.description?.trim();
    if (!text) {
      return [
        "The Kinetic Lab isn't just a gym; it's a meticulously engineered ecosystem for physical evolution.",
        "Our training floor features custom-engineered equipment and recovery options optimized for peak performance.",
      ];
    }
    const parts = text.split(/\n\n+/).filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(0, 2);
    }
    return [text];
  }, [club.description]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/60 px-6 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/clubs/navigator" className="text-xl font-bold tracking-tight text-primary">
            Amber Nocturne
          </Link>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-muted-foreground transition-all duration-300 hover:bg-muted/40 hover:text-foreground/90"
            >
              Home
            </Link>
            <Link
              href="/clubs/navigator"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-primary"
            >
              Clubs
            </Link>
            <Link
              href="/account/memberships"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-muted-foreground transition-all duration-300 hover:bg-muted/40 hover:text-foreground/90"
            >
              Benefits
            </Link>
            <Link
              href="/account/billing"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-muted-foreground transition-all duration-300 hover:bg-muted/40 hover:text-foreground/90"
            >
              Account
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Notifications"
            >
              <MatIcon name="notifications" />
            </button>
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Help"
            >
              <MatIcon name="help" />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element -- external Stitch asset; no optimization required */}
              <img alt="" src={KINETIC_LAB_AVATAR_IMAGE} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <button type="button" className="text-muted-foreground md:hidden" aria-label="Menu">
          <MatIcon name="menu" />
        </button>
      </header>

      <main className="pb-24 pt-16 lg:pb-12">
        {/* Hero */}
        <section className="relative h-[clamp(320px,85vh,614px)] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={KINETIC_LAB_HERO_IMAGE} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full max-w-5xl p-8 lg:p-16">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-foreground">
                Premium Venue
              </span>
              <div className="flex items-center gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MatIcon key={i} name="star" className="text-sm" filled />
                ))}
                <span className="ml-2 text-sm font-semibold text-foreground/85">(128 reviews)</span>
              </div>
            </div>
            <h1 className="mb-2 text-4xl font-bold leading-[1.2] tracking-[-0.02em] text-foreground">
              {club.name}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/85">{club.description}</p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-8 py-8 lg:px-16 lg:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
            {/* About + amenities */}
            <div className="space-y-6 lg:col-span-2">
              <h2 className="text-2xl font-semibold leading-snug tracking-tight text-primary">
                Elite Standards, Precision Results
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                {aboutParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
                {[
                  { icon: "fitness_center" as const, label: "Custom Steel" },
                  { icon: "spa" as const, label: "Recovery Spa" },
                  { icon: "restaurant_menu" as const, label: "Juice Lab" },
                  { icon: "wifi" as const, label: "Gigabit Fiber" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      kineticStyles.glassPanel,
                      "flex flex-col items-center rounded-2xl p-4 text-center transition-colors hover:bg-muted/40",
                    )}
                  >
                    <MatIcon name={item.icon} className="mb-2 text-primary" />
                    <span className="text-sm font-semibold tracking-wide text-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick details */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <MatIcon name="info" className="text-primary" />
                  Quick Details
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <MatIcon name="location_on" className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">402 Vector Drive</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Tech District, SF
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <MatIcon name="schedule" className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Open 24/7</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Members Only Access
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <MatIcon name="group" className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {members.length} member{members.length === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Roster
                      </p>
                    </div>
                  </li>
                </ul>
                <button
                  type="button"
                  disabled={sortedPlans.length === 0 || subscribePending}
                  onClick={() => {
                    const first = sortedPlans[0]?.id;
                    if (first) {
                      onJoinPlan(first);
                    }
                  }}
                  className="mt-8 w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-95 disabled:opacity-50"
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Membership tiers — data from API, layout from Stitch */}
          <div className="mt-16">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-semibold leading-tight tracking-tight text-foreground">
                Select Your Membership
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Choose the tier that aligns with your ambitions. All memberships include a 15-day recovery pass.
              </p>
            </div>
            {resultMessage ? (
              <p className="mb-6 text-center text-sm text-muted-foreground">{resultMessage}</p>
            ) : null}
            {sortedPlans.length === 0 ? (
              <p className="text-center text-muted-foreground">No active plans for this club yet.</p>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  sortedPlans.length === 1 && "md:grid-cols-1",
                  sortedPlans.length === 2 && "md:grid-cols-2",
                  sortedPlans.length >= 3 && "md:grid-cols-3",
                )}
              >
                {sortedPlans.map((plan, index) => {
                  const isPopular = popularIndex === index;
                  const isSelected = selectedPlanId === plan.id;
                  const price = (plan.amountCents / 100).toFixed(0);
                  const interval = plan.interval === "year" ? "yr" : "mo";
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "group rounded-3xl border p-6 transition-all hover:-translate-y-2 hover:shadow-2xl",
                        isPopular
                          ? "relative border-2 border-primary/50 bg-popover shadow-xl shadow-primary/20"
                          : "border-border bg-surface-container-low",
                      )}
                    >
                      {isPopular ? (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                          Most Popular
                        </div>
                      ) : null}
                      <div className="mb-6">
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                          {plan.interval === "year" ? "Annual" : "Monthly"}
                        </span>
                        <h3 className="mt-1 text-2xl font-semibold text-foreground">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-foreground">${price}</span>
                          <span className="text-muted-foreground">/{interval}</span>
                          <span className="ml-2 text-xs uppercase text-muted-foreground">
                            {plan.currency}
                          </span>
                        </div>
                      </div>
                      <ul className="mb-8 space-y-4">
                        <li className="flex items-center gap-2 text-foreground/85">
                          <MatIcon
                            name="check_circle"
                            className={cn("text-lg", isPopular ? "text-primary" : "text-primary/60")}
                            filled={isPopular}
                          />
                          Full access to club facilities
                        </li>
                        <li className="flex items-center gap-2 text-foreground/85">
                          <MatIcon
                            name="check_circle"
                            className={cn("text-lg", isPopular ? "text-primary" : "text-primary/60")}
                            filled={isPopular}
                          />
                          Billing through your saved payment method
                        </li>
                        <li className="flex items-center gap-2 text-foreground/85">
                          <MatIcon
                            name="check_circle"
                            className={cn("text-lg", isPopular ? "text-primary" : "text-primary/60")}
                            filled={isPopular}
                          />
                          Cancel requests from memberships
                        </li>
                      </ul>
                      <button
                        type="button"
                        disabled={subscribePending}
                        onClick={() => {
                          onSelectPlan(plan.id);
                          onJoinPlan(plan.id);
                        }}
                        className={cn(
                          "w-full rounded-xl py-4 text-sm font-bold transition-all active:scale-95 disabled:opacity-50",
                          isPopular
                            ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                            : "border border-border text-foreground/85 hover:bg-muted hover:text-foreground",
                          isSelected && !isPopular && "ring-2 ring-primary/60",
                        )}
                      >
                        {subscribePending && isSelected ? "Joining…" : `Join ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Events */}
          <div className="mt-16">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="mb-1 text-3xl font-semibold text-foreground">Upcoming Events</h2>
                <p className="text-muted-foreground">Exclusive community workshops and athlete showcases.</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
              >
                View Full Calendar <MatIcon name="arrow_forward" className="text-sm" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                className={cn(
                  kineticStyles.glassPanel,
                  "group flex cursor-pointer flex-col gap-6 rounded-3xl p-4 sm:flex-row",
                )}
              >
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src={KINETIC_LAB_EVENT_HIIT_IMAGE}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-between py-2">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Workshop
                      </span>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        Oct 24 • 6:00 PM
                      </span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold text-foreground">Metabolic Ignition Series</h4>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      Master the science of high-intensity conditioning with guest coach Marcus Thorne.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="-space-x-2 flex">
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted" />
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-border" />
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-secondary" />
                      </div>
                      <span className="ml-4 self-center text-[10px] text-muted-foreground">+42 attending</span>
                    </div>
                    <MatIcon
                      name="arrow_forward_ios"
                      className="text-muted-foreground/70 transition-colors group-hover:text-primary"
                    />
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  kineticStyles.glassPanel,
                  "group flex cursor-pointer flex-col gap-6 rounded-3xl p-4 sm:flex-row",
                )}
              >
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src={KINETIC_LAB_EVENT_YOGA_IMAGE}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-between py-2">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Mindset
                      </span>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        Oct 28 • 7:30 AM
                      </span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold text-foreground">Mind-Muscle Equilibrium</h4>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      A sunrise recovery flow focused on neurological downregulation and mobility.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="-space-x-2 flex">
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted" />
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-border" />
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-secondary" />
                      </div>
                      <span className="ml-4 self-center text-[10px] text-muted-foreground">+18 attending</span>
                    </div>
                    <MatIcon
                      name="arrow_forward_ios"
                      className="text-muted-foreground/70 transition-colors group-hover:text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members — not in original Stitch hero file; matches billing-table density */}
          {members.length > 0 ? (
            <div className="mt-16">
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Current members</h2>
              <div
                className={cn(
                  kineticStyles.glassPanel,
                  "overflow-x-auto rounded-3xl border border-border/50",
                )}
              >
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.userId} className="border-b border-border/80 last:border-0">
                        <td className="px-4 py-3 text-foreground">{m.email}</td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-border bg-card/80 pb-4 pt-2 shadow-lg shadow-background/50 backdrop-blur-lg md:hidden">
        <Link href="/" className="flex flex-col items-center text-muted-foreground active:scale-90">
          <MatIcon name="home" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Home</span>
        </Link>
        <Link
          href="/clubs/navigator"
          className="flex scale-110 flex-col items-center text-primary active:scale-90"
        >
          <MatIcon name="explore" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Explore</span>
        </Link>
        <Link
          href="/account/memberships"
          className="flex flex-col items-center text-muted-foreground active:scale-90"
        >
          <MatIcon name="military_tech" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Benefits</span>
        </Link>
        <Link href="/account/billing" className="flex flex-col items-center text-muted-foreground active:scale-90">
          <MatIcon name="person" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Account</span>
        </Link>
      </nav>
    </div>
  );
}
