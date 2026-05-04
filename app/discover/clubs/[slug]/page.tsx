import {
  clubLandingContent,
  clubLandingDisplayNameToSlug,
  resolveClubLandingContent,
} from "@/data/clubs";
import Landing from "@/components/clubs/template/landing";

export function generateStaticParams(): { slug: string }[] {
  return clubLandingContent.map((entry) => ({
    slug: clubLandingDisplayNameToSlug(entry.name),
  }));
}

export default async function DiscoverClubBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  return (
    <Landing
      isAuthenticated={false}
      clubLandingContent={resolveClubLandingContent(slug)}
    />
  );
}
