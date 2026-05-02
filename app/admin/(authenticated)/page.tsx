import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { AdminBootstrap } from "@/components/admin/admin-bootstrap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminBootstrapEnabled } from "@/lib/security";

export default async function AdminHomePage(): Promise<React.JSX.Element> {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <AdminNav />

      <Card>
        <CardHeader>
          <CardTitle>Admin features</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          <Link href="/admin/clubs" className="underline">
            Manage clubs
          </Link>
          <Link href="/admin/cancellation-requests" className="underline">
            Process cancellation requests
          </Link>
        </CardContent>
      </Card>

      {isAdminBootstrapEnabled() ? <AdminBootstrap /> : null}
    </main>
  );
}
