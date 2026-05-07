import { AdminNav } from "@/components/admin-nav";
import { AdminClubCreateForm } from "@/components/admin/clubs/admin-club-create-form";

export default async function AdminNewClubPage(): Promise<React.JSX.Element> {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin: Create club</h1>
      <AdminNav />
      <AdminClubCreateForm />
    </main>
  );
}
