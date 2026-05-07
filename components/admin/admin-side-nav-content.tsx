"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

type MatIconProps = { name: string; className?: string };

function MatIcon({ name, className }: MatIconProps): React.JSX.Element {
  return (
    <span className={cn("material-symbols-outlined align-middle", className)}>{name}</span>
  );
}

const baseLinkClassName =
  "flex cursor-pointer items-center gap-4 rounded-xl p-3 text-muted-foreground transition-transform duration-200 hover:translate-x-1 hover:bg-muted/30 hover:text-foreground/90 active:opacity-80";

const activeLinkClassName =
  "flex cursor-pointer items-center gap-4 rounded-l-xl border-r-2 border-primary bg-muted/50 p-3 text-primary transition-transform duration-200 hover:translate-x-1 active:opacity-80";

const collapsedBaseLink =
  "flex cursor-pointer items-center justify-center rounded-xl p-3 text-muted-foreground transition-colors duration-200 hover:bg-muted/30 hover:text-foreground/90 active:opacity-80";

const collapsedActiveLink =
  "flex cursor-pointer items-center justify-center rounded-xl border-2 border-primary/80 bg-muted/50 p-3 text-primary transition-colors duration-200 active:opacity-80";

const subLinkBase =
  "flex cursor-pointer items-center gap-2 rounded-lg py-2 pl-3 pr-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground";

const subLinkActive = "bg-muted/50 font-medium text-primary";

function navLinkClassName(isActive: boolean, collapsed: boolean): string {
  if (collapsed) {
    return isActive ? collapsedActiveLink : collapsedBaseLink;
  }
  return isActive ? activeLinkClassName : baseLinkClassName;
}

/** Reserved under `/admin/clubs/*` — not a club UUID. */
const CLUBS_SEGMENT_EXCLUDE = new Set(["new"]);

function parseClubIdFromPath(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "admin" || segments[1] !== "clubs" || !segments[2]) {
    return undefined;
  }
  const candidate = segments[2];
  if (CLUBS_SEGMENT_EXCLUDE.has(candidate)) {
    return undefined;
  }
  return candidate;
}

type AdminSideNavContentProps = {
  collapsed: boolean;
  /** Renders the desktop aside column. */
  mode: "desktop" | "mobile";
};

/**
 * Admin-only sidebar / mobile nav: nested Clubs + optional current-club links.
 */
export function AdminSideNavContent({
  collapsed,
  mode,
}: AdminSideNavContentProps): React.JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase");

  const clubId = parseClubIdFromPath(pathname);
  const onClubsDirectory = pathname === "/admin/clubs" || pathname === "/admin/clubs/";
  const underClubs = pathname.startsWith("/admin/clubs");

  const [clubsOpen, setClubsOpen] = React.useState(() => pathname.startsWith("/admin/clubs"));

  React.useEffect(() => {
    if (pathname.startsWith("/admin/clubs")) {
      setClubsOpen(true);
    }
  }, [pathname]);

  const overviewActive = pathname === "/admin" || pathname === "/admin/";

  const allClubsActive = onClubsDirectory && (phase == null || phase === "");
  const inDesignActive = onClubsDirectory && phase === "in_design";
  const liveActive = onClubsDirectory && phase === "live";
  const createClubActive = pathname === "/admin/clubs/new" || pathname === "/admin/clubs/new/";

  const clubOverviewActive =
    clubId != null && (pathname === `/admin/clubs/${clubId}` || pathname === `/admin/clubs/${clubId}/`);
  const landingActive = clubId != null && pathname.startsWith(`/admin/clubs/${clubId}/landing`);
  const plansActive = clubId != null && pathname.startsWith(`/admin/clubs/${clubId}/plans`);

  if (mode === "mobile") {
    return (
      <>
        <Link
          href="/admin"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            overviewActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Overview
        </Link>
        <Link
          href="/admin/clubs"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            onClubsDirectory && (phase == null || phase === "")
              ? "text-primary"
              : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Clubs
        </Link>
        <Link
          href="/admin/clubs?phase=in_design"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            inDesignActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          In design
        </Link>
        <Link
          href="/admin/clubs?phase=live"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            liveActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Live
        </Link>
        <Link
          href="/admin/clubs/new"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            createClubActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Create club
        </Link>
        {clubId ? (
          <>
            <Link
              href={`/admin/clubs/${clubId}`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
                clubOverviewActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Club overview
            </Link>
            <Link
              href={`/admin/clubs/${clubId}/landing`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
                landingActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Landing
            </Link>
            <Link
              href={`/admin/clubs/${clubId}/plans`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
                plansActive ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Plans
            </Link>
          </>
        ) : null}
        <Link
          href="/admin/cancellation-requests"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            pathname.startsWith("/admin/cancellation-requests")
              ? "text-primary"
              : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Cancellations
        </Link>
        <Link
          href="/admin/members"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            pathname.startsWith("/admin/members") ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Members
        </Link>
        <Link
          href="/admin/concierges"
          className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
            pathname.startsWith("/admin/concierges") ? "text-primary" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          Concierges
        </Link>
      </>
    );
  }

  /* Desktop aside */
  if (collapsed) {
    return (
      <>
        <Link
          href="/admin"
          title="Overview"
          className={navLinkClassName(overviewActive, true)}
        >
          <MatIcon name="admin_panel_settings" />
        </Link>
        <Link href="/admin/clubs" title="Clubs" className={navLinkClassName(underClubs, true)}>
          <MatIcon name="groups" />
        </Link>
        <Link
          href="/admin/clubs/new"
          title="Create club"
          className={navLinkClassName(createClubActive, true)}
        >
          <MatIcon name="add_circle" />
        </Link>
        {clubId ? (
          <>
            <Link
              href={`/admin/clubs/${clubId}`}
              title="Club overview"
              className={navLinkClassName(clubOverviewActive, true)}
            >
              <MatIcon name="info" />
            </Link>
            <Link
              href={`/admin/clubs/${clubId}/landing`}
              title="Landing page"
              className={navLinkClassName(landingActive, true)}
            >
              <MatIcon name="web" />
            </Link>
            <Link
              href={`/admin/clubs/${clubId}/plans`}
              title="Plans"
              className={navLinkClassName(plansActive, true)}
            >
              <MatIcon name="payments" />
            </Link>
          </>
        ) : null}
        <Link
          href="/admin/cancellation-requests"
          title="Cancellations"
          className={navLinkClassName(pathname.startsWith("/admin/cancellation-requests"), true)}
        >
          <MatIcon name="cancel" />
        </Link>
        <Link
          href="/admin/members"
          title="Members"
          className={navLinkClassName(pathname.startsWith("/admin/members"), true)}
        >
          <MatIcon name="people" />
        </Link>
        <Link
          href="/admin/concierges"
          title="Concierges"
          className={navLinkClassName(pathname.startsWith("/admin/concierges"), true)}
        >
          <MatIcon name="support_agent" />
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/admin" className={navLinkClassName(overviewActive, false)}>
        <MatIcon name="admin_panel_settings" />
        <span>Overview</span>
      </Link>

      <div className="space-y-1">
        <button
          type="button"
          className={cn(baseLinkClassName, "w-full", underClubs && "bg-muted/30")}
          aria-expanded={clubsOpen}
          onClick={() => setClubsOpen((o) => !o)}
        >
          <MatIcon name="groups" />
          <span className="flex-1 text-left">Clubs</span>
          <MatIcon
            name="expand_more"
            className={cn("transition-transform", clubsOpen ? "rotate-180" : "")}
          />
        </button>
        {clubsOpen ? (
          <div className="ml-3 space-y-0.5 border-l border-border pl-3">
            <Link href="/admin/clubs" className={cn(subLinkBase, allClubsActive && subLinkActive)}>
              All clubs
            </Link>
            <Link
              href="/admin/clubs?phase=in_design"
              className={cn(subLinkBase, inDesignActive && subLinkActive)}
            >
              In design
            </Link>
            <Link href="/admin/clubs?phase=live" className={cn(subLinkBase, liveActive && subLinkActive)}>
              Live
            </Link>
            <Link href="/admin/clubs/new" className={cn(subLinkBase, createClubActive && subLinkActive)}>
              Create club
            </Link>
            {clubId ? (
              <>
                <div className="py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Current club
                </div>
                <Link
                  href={`/admin/clubs/${clubId}`}
                  className={cn(subLinkBase, clubOverviewActive && subLinkActive)}
                >
                  Overview
                </Link>
                <Link
                  href={`/admin/clubs/${clubId}/landing`}
                  className={cn(subLinkBase, landingActive && subLinkActive)}
                >
                  Landing page
                </Link>
                <Link
                  href={`/admin/clubs/${clubId}/plans`}
                  className={cn(subLinkBase, plansActive && subLinkActive)}
                >
                  Plans
                </Link>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <Link
        href="/admin/cancellation-requests"
        className={navLinkClassName(pathname.startsWith("/admin/cancellation-requests"), false)}
      >
        <MatIcon name="cancel" />
        <span>Cancellations</span>
      </Link>
      <Link
        href="/admin/members"
        className={navLinkClassName(pathname.startsWith("/admin/members"), false)}
      >
        <MatIcon name="people" />
        <span>Members</span>
      </Link>
      <Link
        href="/admin/concierges"
        className={navLinkClassName(pathname.startsWith("/admin/concierges"), false)}
      >
        <MatIcon name="support_agent" />
        <span>Concierges</span>
      </Link>
    </>
  );
}
