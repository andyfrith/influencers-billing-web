import { redirect } from "next/navigation";

import { AdminCancellationRequests } from "@/components/admin/admin-cancellation-requests";
import { getAppSession } from "@/lib/session";

export default async function AdminCancellationRequestsPage(): Promise<React.JSX.Element> {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Cancellation Requests</h1>
      <AdminCancellationRequests />
    </main>
  );
}
