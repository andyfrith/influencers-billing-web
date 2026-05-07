"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type JoinButtonProps = Pick<
  ComponentProps<typeof Button>,
  "className" | "size" | "variant"
> & {
  /** Renders a compact control for narrow sidebars (icon + accessible name). */
  iconOnly?: boolean;
  slug: string;
};

export function JoinButton({
  className,
  slug,
  size = "default",
  variant = "outline",
  iconOnly = false,
}: JoinButtonProps): React.JSX.Element {
  const router = useRouter();
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      title={iconOnly ? "Join" : undefined}
      aria-label={iconOnly ? "Join" : undefined}
      onClick={() => {
        router.push(`/join/clubs/${slug}`);
      }}
    >
      {iconOnly ? (
        <span className="material-symbols-outlined text-[22px] leading-none">
          Join
        </span>
      ) : (
        "Join"
      )}
    </Button>
  );
}
