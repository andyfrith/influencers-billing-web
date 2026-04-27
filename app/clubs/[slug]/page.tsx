import { ClubDetail } from "@/components/clubs/club-detail";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <ClubDetail slug={slug} />
    </main>
  );
}
