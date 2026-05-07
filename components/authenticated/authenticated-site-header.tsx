"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { ThemePicker } from "@/components/theme-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "../auth/sign-out-button";

type NavItem = {
  href: string;
  label: string;
  /** How to compare `pathname` for the current indicator. */
  match: "exact" | "prefix" | "none";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", match: "exact" },
  { href: "/clubs", label: "Clubs", match: "prefix" },
  { href: "/#about", label: "About", match: "none" },
  { href: "/forgot-password", label: "Support", match: "prefix" },
  { href: "/sign-in", label: "Membership", match: "prefix" },
];

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.match === "none") {
    return false;
  }
  if (item.match === "exact") {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AuthenticatedSiteHeader(): React.JSX.Element {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  return (
    <header className="shrink-0 bg-surface-deepest">
      <div className="flex h-20 w-full items-center justify-around gap-3 px-4 sm:px-5 md:px-6">
        <Link
          href="/"
          className="text-xl font-bold uppercase tracking-[0.14em] text-primary"
        >
          {slug ? slug : "Discoveries"}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "border-b-2 border-primary pb-1 font-semibold text-primary"
                    : "transition-colors hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <ThemePicker className="inline-flex max-sm:max-w-34" />
          <Link
            href="/sign-in"
            className="text-xs font-semibold text-primary hover:underline md:hidden"
          >
            Sign in
          </Link>
          {/* <Button
            asChild
            className="h-9 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            <Link href="/join/clubs/the-greenhouse">Join</Link>
          </Button> */}
          {slug && (
            <SignOutButton
              className="h-8 border-border bg-transparent px-3 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              size="sm"
              slug={slug}
            />
          )}
          <ThemeToggle
            size="sm"
            className="shrink-0 border-border bg-card/80"
          />
        </div>
      </div>
    </header>
  );
}
