"use client";

import { signOut } from "next-auth/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type SignOutButtonProps = Pick<ComponentProps<typeof Button>, "className" | "size" | "variant">;

export function SignOutButton({
  className,
  size = "default",
  variant = "outline",
}: SignOutButtonProps = {}): React.JSX.Element {
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      onClick={() => {
        void signOut({ callbackUrl: "/" });
      }}
    >
      Sign out
    </Button>
  );
}
