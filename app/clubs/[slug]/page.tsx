import { ClubDetail } from "@/components/clubs/club-detail";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col">
      <ClubDetail slug={slug} />
    </main>
  );
}
