import { MembershipsList } from "@/components/memberships/memberships-list";

export default async function MembershipsPage(): Promise<React.JSX.Element> {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Memberships</h1>
      <MembershipsList />
    </main>
  );
}
