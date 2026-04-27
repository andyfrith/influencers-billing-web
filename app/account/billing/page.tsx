import { redirect } from "next/navigation";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { BillingCardManager } from "@/components/billing/billing-card-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppSession } from "@/lib/session";

export default async function BillingPage(): Promise<React.JSX.Element> {
  const session = await getAppSession();

  if (!session?.user?.id || !session.user.email) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Billing account</h1>
          <p className="text-sm text-zinc-600">{session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link className="text-sm underline" href="/clubs">
            Clubs
          </Link>
          <Link className="text-sm underline" href="/account/memberships">
            Memberships
          </Link>
          {session.user.role === "admin" ? (
            <Link className="text-sm underline" href="/admin">
              Admin
            </Link>
          ) : null}
          <SignOutButton />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Card data is handled by Stripe Elements and never stored in local database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-700">
            This page always reads current payment method details directly from Stripe.
          </p>
        </CardContent>
      </Card>

      <BillingCardManager />
    </main>
  );
}
