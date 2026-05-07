import Landing from "@/components/clubs/template/landing";
import { resolveClubLandingPageContent } from "@/lib/club-landing-resolution";
import { getDiscoverClubSlugParams } from "@/lib/discover-club-static-params";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getDiscoverClubSlugParams();
}

export default async function DiscoverClubBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const clubLandingContent = await resolveClubLandingPageContent(slug);

  return <Landing isAuthenticated={false} clubLandingContent={clubLandingContent} />;
}
