"use client";

import { signOut } from "next-auth/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type SignOutButtonProps = Pick<ComponentProps<typeof Button>, "className" | "size" | "variant"> & {
  /** Renders a compact control for narrow sidebars (icon + accessible name). */
  iconOnly?: boolean;
};

export function SignOutButton({
  className,
  size = "default",
  variant = "outline",
  iconOnly = false,
}: SignOutButtonProps = {}): React.JSX.Element {
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      title={iconOnly ? "Sign out" : undefined}
      aria-label={iconOnly ? "Sign out" : undefined}
      onClick={() => {
        void signOut({ callbackUrl: "/" });
      }}
    >
      {iconOnly ? (
        <span className="material-symbols-outlined text-[22px] leading-none">logout</span>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
