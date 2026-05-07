"use client";

import * as React from "react";
import { SideNav } from "@/components/admin/side-nav";

const NAV_COLLAPSED_STORAGE_KEY = "influencers-billing-nav-collapsed";

type AdminShellProps = {
  children: React.ReactNode;
};

/**
 * Wraps authenticated layout: persists sidebar width and keeps main content
 * padding in sync with the fixed side navigation.
 */
export function AdminShell({ children }: AdminShellProps): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY) === "1") {
        setCollapsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <div
      className={`flex min-h-screen flex-1 flex-col transition-[padding] duration-200 ease-out ${
        collapsed ? "lg:pl-20" : "lg:pl-64"
      }`}
    >
      <SideNav variant="admin" collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
