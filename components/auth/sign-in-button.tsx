"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type SignInButtonProps = Pick<
  ComponentProps<typeof Button>,
  "className" | "size" | "variant"
> & {
  /** Renders a compact control for narrow sidebars (icon + accessible name). */
  iconOnly?: boolean;
  slug: string;
};

export function SignInButton({
  className,
  slug,
  size = "default",
  variant = "outline",
  iconOnly = false,
}: SignInButtonProps): React.JSX.Element {
  const router = useRouter();
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      title={iconOnly ? "Sign out" : undefined}
      aria-label={iconOnly ? "Sign out" : undefined}
      onClick={() => {
        router.push(`/sign-in/clubs/${slug}`);
      }}
    >
      {iconOnly ? (
        <span className="material-symbols-outlined text-[22px] leading-none">
          sign in
        </span>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}
