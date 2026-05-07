import { Suspense } from "react";

import { AdminNav } from "@/components/admin-nav";
import { AdminClubDetail } from "@/components/admin/admin-club-detail";

export default async function AdminClubDetailPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}): Promise<React.JSX.Element> {
  const { clubId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Club</h1>
      <AdminNav clubId={clubId} />
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <AdminClubDetail clubId={clubId} />
      </Suspense>
    </main>
  );
}
