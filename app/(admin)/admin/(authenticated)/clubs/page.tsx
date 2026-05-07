import { Suspense } from "react";
import { AdminClubsDirectory } from "@/components/admin/clubs/admin-clubs-directory";

export default async function AdminClubsPage(): Promise<React.JSX.Element> {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Clubs</h1>
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading directory…</p>
        }
      >
        <AdminClubsDirectory />
      </Suspense>
    </main>
  );
}
