import { AdminNav } from "@/components/admin-nav";
import { AdminClubPlansManager } from "@/components/admin/admin-club-plans-manager";

export default async function AdminClubPlansPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}): Promise<React.JSX.Element> {
  const { clubId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Club Plans</h1>
      <AdminNav clubId={clubId} />
      <AdminClubPlansManager clubId={clubId} />
    </main>
  );
}
