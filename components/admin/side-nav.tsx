"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

import { AdminSideNavContent } from "@/components/admin/admin-side-nav-content";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemePicker } from "@/components/theme-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  /** When set, item is active if pathname starts with this prefix. */
  matchPrefix?: string;
  /** Overrides prefix / href matching when set. */
  isActive?: (pathname: string) => boolean;
};

type SideNavProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Admin shell uses dedicated links; members see dashboard / clubs / account routes. */
  variant?: "member" | "admin";
};

const baseLinkClassName =
  "flex cursor-pointer items-center gap-4 rounded-xl p-3 text-muted-foreground transition-transform duration-200 hover:translate-x-1 hover:bg-muted/30 hover:text-foreground/90 active:opacity-80";

const activeLinkClassName =
  "flex cursor-pointer items-center gap-4 rounded-l-xl border-r-2 border-primary bg-muted/50 p-3 text-primary transition-transform duration-200 hover:translate-x-1 active:opacity-80";

const collapsedBaseLink =
  "flex cursor-pointer items-center justify-center rounded-xl p-3 text-muted-foreground transition-colors duration-200 hover:bg-muted/30 hover:text-foreground/90 active:opacity-80";

const collapsedActiveLink =
  "flex cursor-pointer items-center justify-center rounded-xl border-2 border-primary/80 bg-muted/50 p-3 text-primary transition-colors duration-200 active:opacity-80";

function MatIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}): React.JSX.Element {
  return (
    <span
      className={`material-symbols-outlined align-middle ${className ?? ""}`}
    >
      {name}
    </span>
  );
}

/**
 * Returns link class names for a primary nav item based on active and collapsed state.
 */
function navLinkClassName(isActive: boolean, collapsed: boolean): string {
  if (collapsed) {
    return isActive ? collapsedActiveLink : collapsedBaseLink;
  }
  return isActive ? activeLinkClassName : baseLinkClassName;
}

/**
 * Shared authenticated sidebar: member routes or admin console links.
 */
export function SideNav({
  collapsed,
  onToggleCollapsed,
  variant = "member",
}: SideNavProps): React.JSX.Element {
  const pathname = usePathname();

  const memberNavItems: NavItem[] = [
    { href: "/", label: "Dashboard", icon: "dashboard" },
    {
      href: "/clubs/navigator",
      label: "Clubs",
      icon: "workspace_premium",
      matchPrefix: "/clubs",
    },
    {
      href: "/account/memberships",
      label: "Memberships",
      icon: "card_membership",
      matchPrefix: "/account/memberships",
    },
    {
      href: "/account/billing",
      label: "Settings",
      icon: "settings",
      matchPrefix: "/account/billing",
    },
  ];

  const navItems = memberNavItems;

  const isItemActive = (item: NavItem): boolean => {
    if (item.isActive) {
      return item.isActive(pathname);
    }
    if (item.href === "/") {
      return pathname === "/";
    }
    if (item.matchPrefix) {
      return pathname.startsWith(item.matchPrefix);
    }
    return pathname === item.href;
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 px-4 py-2 backdrop-blur-md lg:hidden">
        <nav className="flex items-center gap-2 overflow-x-auto">
          {variant === "admin" ? (
            <Suspense fallback={null}>
              <AdminSideNavContent collapsed={false} mode="mobile" />
            </Suspense>
          ) : (
            navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
                  isItemActive(item)
                    ? "text-primary"
                    : "text-muted-foreground transition-all duration-300 hover:bg-muted/40 hover:text-foreground/90"
                }`}
              >
                {item.label}
              </Link>
            ))
          )}
          {variant === "member" ? (
            <ThemePicker className="inline-flex max-w-[7.5rem] shrink-0" />
          ) : null}
          <ThemeToggle
            size="sm"
            className="h-8 shrink-0 border-border bg-transparent px-2"
          />
          <SignOutButton
            size="sm"
            className="h-8 border-border bg-transparent px-3 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          />
        </nav>
      </header>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col rounded-r-2xl border-r border-border bg-surface-panel pb-8 pt-4 shadow-2xl shadow-background/80 lg:flex",
          collapsed ? "w-20 items-stretch px-2" : "w-64 space-y-2 p-4",
        )}
      >
        <div
          className={cn(
            "mb-2 flex shrink-0 items-center gap-1",
            collapsed ? "justify-center" : "justify-end px-2",
          )}
        >
          {/* <ThemePicker className="hidden shrink-0 lg:inline-flex" /> */}
          {/* <ThemeToggle
            size="sm"
            className="h-8 shrink-0 border-border bg-transparent px-2"
          /> */}
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground/90"
          >
            <MatIcon name={collapsed ? "chevron_right" : "chevron_left"} />
          </button>
        </div>

        {collapsed ? (
          <div
            className="mb-6 flex justify-center"
            title="Amber Hub — Elite Member"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <MatIcon name="bolt" className="text-primary-foreground" />
            </div>
          </div>
        ) : (
          <>
            {/* <div className="mb-6 px-2 text-lg font-black text-primary">
              Amber Hub
            </div> */}
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <MatIcon name="bolt" className="text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-foreground">Admin</div>
                <div className="text-xs text-muted-foreground">
                  Influencers Billing
                </div>
              </div>
            </div>
          </>
        )}

        <nav
          className={cn(
            "flex flex-1 flex-col",
            collapsed ? "items-stretch space-y-1" : "space-y-1",
          )}
        >
          {variant === "admin" ? (
            <Suspense
              fallback={<div className="mx-1 h-40 animate-pulse rounded-xl bg-muted/40" aria-hidden />}
            >
              <AdminSideNavContent collapsed={collapsed} mode="desktop" />
            </Suspense>
          ) : (
            navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={navLinkClassName(isItemActive(item), collapsed)}
              >
                <MatIcon name={item.icon} />
                {collapsed ? null : <span>{item.label}</span>}
              </Link>
            ))
          )}
        </nav>

        <div
          className={cn(
            "mt-auto space-y-1 border-t border-border pt-4",
            collapsed && "flex flex-col items-stretch",
          )}
        >
          <div
            className={cn(
              "flex cursor-pointer items-center rounded-xl p-3 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground/90",
              collapsed ? "justify-center" : "gap-4",
            )}
            title={collapsed ? "Support" : undefined}
          >
            <MatIcon name="contact_support" />
            {collapsed ? null : <span>Support</span>}
            <ThemeToggle
              size="sm"
              className="h-8 shrink-0 border-border bg-transparent px-2"
            />
          </div>

          <div className={cn("pt-3", collapsed && "flex justify-center")}>
            <SignOutButton
              iconOnly={collapsed}
              className={cn(
                "border-border bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                collapsed && "size-10 shrink-0 p-0",
              )}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
