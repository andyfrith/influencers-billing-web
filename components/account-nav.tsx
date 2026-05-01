import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";

type AccountNavProps = {
  isAdmin: boolean;
};

export function AccountNav({ isAdmin }: AccountNavProps): React.JSX.Element {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Link className="text-sm underline" href="/account/billing">
        Billing
      </Link>
      <Link className="text-sm underline" href="/clubs">
        Clubs
      </Link>
      <Link className="text-sm underline" href="/account/memberships">
        Memberships
      </Link>
      {isAdmin ? (
        <Link className="text-sm underline" href="/admin">
          Admin
        </Link>
      ) : null}
      <SignOutButton />
    </nav>
  );
}
