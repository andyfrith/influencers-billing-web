import { ClubsDirectory } from "@/components/clubs/clubs-directory";

export default function ClubsPage(): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <ClubsDirectory />
    </main>
  );
}
