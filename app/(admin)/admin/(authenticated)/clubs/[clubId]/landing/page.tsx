import { AdminNav } from "@/components/admin-nav";
import { AdminClubLandingEditor } from "@/components/admin/clubs/admin-club-landing-editor";

export default async function AdminClubLandingPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}): Promise<React.JSX.Element> {
  const { clubId } = await params;

  return (
    <main className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 px-3 pb-4 pt-6 sm:px-4">
        <h1 className="text-2xl font-semibold">Admin: Club landing page</h1>
        <AdminNav clubId={clubId} />
      </div>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <AdminClubLandingEditor key={clubId} clubId={clubId} />
      </div>
    </main>
  );
}
