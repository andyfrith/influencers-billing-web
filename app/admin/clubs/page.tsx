import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { AdminClubsManager } from "@/components/admin/admin-clubs-manager";
import { getAppSession } from "@/lib/session";

export default async function AdminClubsPage(): Promise<React.JSX.Element> {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Clubs</h1>
      <AdminNav />
      <AdminClubsManager />
    </main>
  );
}
