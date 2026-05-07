"use client";

import { signOut } from "next-auth/react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CLUB_LANDING_SLUG } from "@/data/clubs";

type SignOutButtonProps = Pick<
  ComponentProps<typeof Button>,
  "className" | "size" | "variant"
> & {
  /** Renders a compact control for narrow sidebars (icon + accessible name). */
  iconOnly?: boolean;
  /** Discover club slug for post-sign-out redirect; defaults to the static default landing. */
  slug?: string;
};

export function SignOutButton({
  className,
  size = "default",
  variant = "outline",
  iconOnly = false,
  slug = DEFAULT_CLUB_LANDING_SLUG,
}: SignOutButtonProps): React.JSX.Element {
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      title={iconOnly ? "Sign Out" : undefined}
      aria-label={iconOnly ? "Sign Out" : undefined}
      onClick={() => {
        void signOut({ callbackUrl: `/discover/clubs/${slug}` });
      }}
    >
      {iconOnly ? (
        <span className="material-symbols-outlined text-[22px] leading-none">
          Sign Out
        </span>
      ) : (
        "Sign Out"
      )}
    </Button>
  );
}
