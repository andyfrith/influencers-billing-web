import { AdminNav } from "@/components/admin-nav";
import { AdminCancellationRequests } from "@/components/admin/admin-cancellation-requests";

export default async function AdminCancellationRequestsPage(): Promise<React.JSX.Element> {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Cancellation Requests</h1>
      <AdminNav />
      <AdminCancellationRequests />
    </main>
  );
}
