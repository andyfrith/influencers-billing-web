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
    <div className="min-h-screen bg-[#161311] text-[#eae1dd] antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-stone-800/50 bg-stone-950/60 px-6 shadow-xl shadow-orange-950/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/clubs/navigator" className="text-xl font-bold tracking-tight text-orange-500">
            Amber Nocturne
          </Link>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-stone-400 transition-all duration-300 hover:bg-stone-800/40 hover:text-stone-200"
            >
              Home
            </Link>
            <Link
              href="/clubs/navigator"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-orange-500"
            >
              Clubs
            </Link>
            <Link
              href="/account/memberships"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-stone-400 transition-all duration-300 hover:bg-stone-800/40 hover:text-stone-200"
            >
              Benefits
            </Link>
            <Link
              href="/account/billing"
              className="rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-stone-400 transition-all duration-300 hover:bg-stone-800/40 hover:text-stone-200"
            >
              Account
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-stone-400 transition-colors hover:text-orange-500"
              aria-label="Notifications"
            >
              <MatIcon name="notifications" />
            </button>
            <button
              type="button"
              className="text-stone-400 transition-colors hover:text-orange-500"
              aria-label="Help"
            >
              <MatIcon name="help" />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-stone-700">
              {/* eslint-disable-next-line @next/next/no-img-element -- external Stitch asset; no optimization required */}
              <img alt="" src={KINETIC_LAB_AVATAR_IMAGE} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <button type="button" className="text-stone-400 md:hidden" aria-label="Menu">
          <MatIcon name="menu" />
        </button>
      </header>

      <main className="pb-24 pt-16 lg:pb-12">
        {/* Hero */}
        <section className="relative h-[clamp(320px,85vh,614px)] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={KINETIC_LAB_HERO_IMAGE} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#161311] via-[#161311]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full max-w-5xl p-8 lg:p-16">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                Premium Venue
              </span>
              <div className="flex items-center gap-0.5 text-orange-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MatIcon key={i} name="star" className="text-sm" filled />
                ))}
                <span className="ml-2 text-sm font-semibold text-stone-300">(128 reviews)</span>
              </div>
            </div>
            <h1 className="mb-2 text-4xl font-bold leading-[1.2] tracking-[-0.02em] text-[#eae1dd]">
              {club.name}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-stone-300">{club.description}</p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-8 py-8 lg:px-16 lg:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
            {/* About + amenities */}
            <div className="space-y-6 lg:col-span-2">
              <h2 className="text-2xl font-semibold leading-snug tracking-tight text-orange-500">
                Elite Standards, Precision Results
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-stone-400">
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
                      "flex flex-col items-center rounded-2xl p-4 text-center transition-colors hover:bg-stone-800/40",
                    )}
                  >
                    <MatIcon name={item.icon} className="mb-2 text-orange-500" />
                    <span className="text-sm font-semibold tracking-wide text-[#eae1dd]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick details */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-[#5a4136] bg-[#231f1d] p-6 shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <MatIcon name="info" className="text-orange-500" />
                  Quick Details
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <MatIcon name="location_on" className="text-stone-500" />
                    <div>
                      <p className="text-sm font-semibold text-[#eae1dd]">402 Vector Drive</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        Tech District, SF
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <MatIcon name="schedule" className="text-stone-500" />
                    <div>
                      <p className="text-sm font-semibold text-[#eae1dd]">Open 24/7</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        Members Only Access
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <MatIcon name="group" className="text-stone-500" />
                    <div>
                      <p className="text-sm font-semibold text-[#eae1dd]">
                        {members.length} member{members.length === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
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
                  className="mt-8 w-full rounded-xl bg-[#ff6b00] py-4 text-sm font-bold text-[#572000] transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] active:scale-95 disabled:opacity-50"
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Membership tiers — data from API, layout from Stitch */}
          <div className="mt-16">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-semibold leading-tight tracking-tight text-[#eae1dd]">
                Select Your Membership
              </h2>
              <p className="mx-auto max-w-xl text-stone-400">
                Choose the tier that aligns with your ambitions. All memberships include a 15-day recovery pass.
              </p>
            </div>
            {resultMessage ? (
              <p className="mb-6 text-center text-sm text-stone-400">{resultMessage}</p>
            ) : null}
            {sortedPlans.length === 0 ? (
              <p className="text-center text-stone-400">No active plans for this club yet.</p>
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
                          ? "relative border-2 border-orange-600/50 bg-[#2e2927] shadow-[0_20px_50px_rgba(255,107,0,0.15)]"
                          : "border-stone-800 bg-[#1f1b19]",
                      )}
                    >
                      {isPopular ? (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                          Most Popular
                        </div>
                      ) : null}
                      <div className="mb-6">
                        <span className="text-xs font-medium uppercase tracking-widest text-stone-500">
                          {plan.interval === "year" ? "Annual" : "Monthly"}
                        </span>
                        <h3 className="mt-1 text-2xl font-semibold text-[#eae1dd]">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-[#eae1dd]">${price}</span>
                          <span className="text-stone-500">/{interval}</span>
                          <span className="ml-2 text-xs uppercase text-stone-500">
                            {plan.currency}
                          </span>
                        </div>
                      </div>
                      <ul className="mb-8 space-y-4">
                        <li className="flex items-center gap-2 text-stone-300">
                          <MatIcon
                            name="check_circle"
                            className={cn("text-lg", isPopular ? "text-orange-500" : "text-orange-500/60")}
                            filled={isPopular}
                          />
                          Full access to club facilities
                        </li>
                        <li className="flex items-center gap-2 text-stone-300">
                          <MatIcon
                            name="check_circle"
                            className={cn("text-lg", isPopular ? "text-orange-500" : "text-orange-500/60")}
                            filled={isPopular}
                          />
                          Billing through your saved payment method
                        </li>
                        <li className="flex items-center gap-2 text-stone-300">
                          <MatIcon
                            name="check_circle"
                            className={cn("text-lg", isPopular ? "text-orange-500" : "text-orange-500/60")}
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
                            ? "bg-orange-600 text-white shadow-lg hover:bg-orange-500"
                            : "border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white",
                          isSelected && !isPopular && "ring-2 ring-orange-500/60",
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
                <h2 className="mb-1 text-3xl font-semibold text-[#eae1dd]">Upcoming Events</h2>
                <p className="text-stone-400">Exclusive community workshops and athlete showcases.</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-orange-500 transition-all hover:gap-2"
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
                      <span className="rounded bg-orange-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                        Workshop
                      </span>
                      <span className="text-[10px] font-bold uppercase text-stone-500">
                        Oct 24 • 6:00 PM
                      </span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold text-[#eae1dd]">Metabolic Ignition Series</h4>
                    <p className="line-clamp-2 text-sm text-stone-400">
                      Master the science of high-intensity conditioning with guest coach Marcus Thorne.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="-space-x-2 flex">
                        <div className="h-6 w-6 rounded-full border-2 border-stone-900 bg-stone-700" />
                        <div className="h-6 w-6 rounded-full border-2 border-stone-900 bg-stone-600" />
                        <div className="h-6 w-6 rounded-full border-2 border-stone-900 bg-stone-500" />
                      </div>
                      <span className="ml-4 self-center text-[10px] text-stone-500">+42 attending</span>
                    </div>
                    <MatIcon
                      name="arrow_forward_ios"
                      className="text-stone-600 transition-colors group-hover:text-orange-500"
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
                      <span className="rounded bg-orange-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                        Mindset
                      </span>
                      <span className="text-[10px] font-bold uppercase text-stone-500">
                        Oct 28 • 7:30 AM
                      </span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold text-[#eae1dd]">Mind-Muscle Equilibrium</h4>
                    <p className="line-clamp-2 text-sm text-stone-400">
                      A sunrise recovery flow focused on neurological downregulation and mobility.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="-space-x-2 flex">
                        <div className="h-6 w-6 rounded-full border-2 border-stone-900 bg-stone-700" />
                        <div className="h-6 w-6 rounded-full border-2 border-stone-900 bg-stone-600" />
                        <div className="h-6 w-6 rounded-full border-2 border-stone-900 bg-stone-500" />
                      </div>
                      <span className="ml-4 self-center text-[10px] text-stone-500">+18 attending</span>
                    </div>
                    <MatIcon
                      name="arrow_forward_ios"
                      className="text-stone-600 transition-colors group-hover:text-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members — not in original Stitch hero file; matches billing-table density */}
          {members.length > 0 ? (
            <div className="mt-16">
              <h2 className="mb-4 text-2xl font-semibold text-[#eae1dd]">Current members</h2>
              <div
                className={cn(
                  kineticStyles.glassPanel,
                  "overflow-x-auto rounded-3xl border border-[#5a4136]/50",
                )}
              >
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-500">
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.userId} className="border-b border-stone-800/80 last:border-0">
                        <td className="px-4 py-3 text-[#eae1dd]">{m.email}</td>
                        <td className="px-4 py-3 capitalize text-stone-400">{m.status}</td>
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
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-stone-800 bg-stone-900/80 pb-4 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-lg md:hidden">
        <Link href="/" className="flex flex-col items-center text-stone-500 active:scale-90">
          <MatIcon name="home" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Home</span>
        </Link>
        <Link
          href="/clubs/navigator"
          className="flex scale-110 flex-col items-center text-orange-500 active:scale-90"
        >
          <MatIcon name="explore" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Explore</span>
        </Link>
        <Link
          href="/account/memberships"
          className="flex flex-col items-center text-stone-500 active:scale-90"
        >
          <MatIcon name="military_tech" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Benefits</span>
        </Link>
        <Link href="/account/billing" className="flex flex-col items-center text-stone-500 active:scale-90">
          <MatIcon name="person" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Account</span>
        </Link>
      </nav>
    </div>
  );
}
