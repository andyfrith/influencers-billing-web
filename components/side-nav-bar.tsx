"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

type SideNavBarProps = {
  isAdmin: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

const baseLinkClassName =
  "flex cursor-pointer items-center gap-4 rounded-xl p-3 text-stone-400 transition-transform duration-200 hover:translate-x-1 hover:bg-stone-800/30 hover:text-stone-200 active:opacity-80";

const activeLinkClassName =
  "flex cursor-pointer items-center gap-4 rounded-l-xl border-r-2 border-orange-500 bg-stone-800/50 p-3 text-orange-500 transition-transform duration-200 hover:translate-x-1 active:opacity-80";

const collapsedBaseLink =
  "flex cursor-pointer items-center justify-center rounded-xl p-3 text-stone-400 transition-colors duration-200 hover:bg-stone-800/30 hover:text-stone-200 active:opacity-80";

const collapsedActiveLink =
  "flex cursor-pointer items-center justify-center rounded-xl border-2 border-orange-500/80 bg-stone-800/50 p-3 text-orange-500 transition-colors duration-200 active:opacity-80";

function MatIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}): React.JSX.Element {
  return (
    <span className={`material-symbols-outlined align-middle ${className ?? ""}`}>{name}</span>
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
 * Shared authenticated navigation rendered for all signed-in users.
 */
export function SideNavBar({
  isAdmin,
  collapsed,
  onToggleCollapsed,
}: SideNavBarProps): React.JSX.Element {
  const pathname = usePathname();

  const navItems: Array<{ href: string; label: string; icon: string; matchPrefix?: string }> = [
    { href: "/", label: "Dashboard", icon: "dashboard" },
    { href: "/clubs/navigator", label: "Clubs", icon: "workspace_premium", matchPrefix: "/clubs" },
    {
      href: "/account/memberships",
      label: "Memberships",
      icon: "card_membership",
      matchPrefix: "/account/memberships",
    },
    { href: "/account/billing", label: "Settings", icon: "settings", matchPrefix: "/account/billing" },
  ];

  if (isAdmin) {
    navItems.push({
      href: "/admin",
      label: "Admin",
      icon: "admin_panel_settings",
      matchPrefix: "/admin",
    });
  }

  const isItemActive = (href: string, matchPrefix?: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    if (matchPrefix) {
      return pathname.startsWith(matchPrefix);
    }
    return pathname === href;
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-800/50 bg-stone-950/90 px-4 py-2 backdrop-blur-md lg:hidden">
        <nav className="flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide ${
                isItemActive(item.href, item.matchPrefix)
                  ? "text-orange-500"
                  : "text-stone-400 transition-all duration-300 hover:bg-stone-800/40 hover:text-stone-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <SignOutButton
            size="sm"
            className="h-8 border-stone-700 bg-transparent px-3 text-xs text-stone-300 hover:bg-stone-800/40 hover:text-stone-100"
          />
        </nav>
      </header>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col rounded-r-2xl border-r border-stone-800 bg-[#1A1614] pb-8 pt-4 shadow-2xl shadow-black lg:flex",
          collapsed ? "w-20 items-stretch px-2" : "w-64 space-y-2 p-4",
        )}
      >
        <div className={cn("mb-2 flex shrink-0", collapsed ? "justify-center" : "justify-end px-2")}>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-800/50 hover:text-stone-200"
          >
            <MatIcon name={collapsed ? "chevron_right" : "chevron_left"} />
          </button>
        </div>

        {collapsed ? (
          <div
            className="mb-6 flex justify-center"
            title="Amber Hub — Elite Member"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
              <MatIcon name="bolt" className="text-stone-950" />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 px-2 text-lg font-black text-orange-500">Amber Hub</div>
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-stone-800/50 bg-stone-800/20 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500">
                <MatIcon name="bolt" className="text-stone-950" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[#eae1dd]">Elite Member</div>
                <div className="text-xs text-stone-500">Influencers Billing</div>
              </div>
            </div>
          </>
        )}

        <nav className={cn("flex flex-1 flex-col", collapsed ? "items-stretch space-y-1" : "space-y-1")}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={navLinkClassName(isItemActive(item.href, item.matchPrefix), collapsed)}
            >
              <MatIcon name={item.icon} />
              {collapsed ? null : <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            "mt-auto space-y-1 border-t border-stone-800 pt-4",
            collapsed && "flex flex-col items-stretch",
          )}
        >
          <div
            className={cn(
              "flex cursor-pointer items-center rounded-xl p-3 text-stone-400 transition-colors hover:bg-stone-800/30 hover:text-stone-200",
              collapsed ? "justify-center" : "gap-4",
            )}
            title={collapsed ? "Support" : undefined}
          >
            <MatIcon name="contact_support" />
            {collapsed ? null : <span>Support</span>}
          </div>

          {collapsed ? (
            <button
              type="button"
              title="Upgrade tier"
              aria-label="Upgrade tier"
              className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-orange-600/10 p-3 font-bold text-orange-500 transition-all hover:bg-orange-600/20 active:scale-95"
            >
              <MatIcon name="workspace_premium" />
            </button>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                className="w-full rounded-xl bg-orange-600/10 px-4 py-3 font-bold text-orange-500 transition-all hover:bg-orange-600/20 active:scale-95"
              >
                Upgrade Tier
              </button>
            </div>
          )}

          <div className={cn("pt-3", collapsed && "flex justify-center")}>
            <SignOutButton
              iconOnly={collapsed}
              className={cn(
                "border-stone-700 bg-transparent text-stone-300 hover:bg-stone-800/40 hover:text-stone-100",
                collapsed && "size-10 shrink-0 p-0",
              )}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
