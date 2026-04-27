import { redirect } from "next/navigation";

import { AdminClubPlansManager } from "@/components/admin/admin-club-plans-manager";
import { getAppSession } from "@/lib/session";

export default async function AdminClubPlansPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}): Promise<React.JSX.Element> {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  const { clubId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Club Plans</h1>
      <AdminClubPlansManager clubId={clubId} />
    </main>
  );
}
