import { Suspense } from "react";

import { AdminNav } from "@/components/admin-nav";
import { AdminClubsDirectory } from "@/components/admin/admin-clubs-directory";

export default async function AdminClubsPage(): Promise<React.JSX.Element> {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Clubs</h1>
      <AdminNav />
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading directory…</p>}>
        <AdminClubsDirectory />
      </Suspense>
    </main>
  );
}
