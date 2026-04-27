import Link from "next/link";
import { getServerSession } from "next-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Customer Billing Portal</CardTitle>
          <CardDescription>
            Securely manage your account and payment method.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {session?.user ? (
            <>
              <Link href="/account/billing">
                <Button>Go to billing</Button>
              </Link>
              <Link href="/clubs">
                <Button variant="outline">Browse clubs</Button>
              </Link>
              <Link href="/account/memberships">
                <Button variant="outline">My memberships</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button>Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">Create account</Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
