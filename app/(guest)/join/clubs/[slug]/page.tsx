import { SignUpForm } from "@/components/join/clubs/sign-up-form";
import { resolveClubLandingPageContent } from "@/lib/club-landing-resolution";
import { getDiscoverClubSlugParams } from "@/lib/discover-club-static-params";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getDiscoverClubSlugParams();
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const landing = await resolveClubLandingPageContent(slug);

  return (
    <main className="flex min-h-[calc(100dvh-5rem)] flex-1 flex-col">
      <SignUpForm clubName={landing.name} joinContent={landing.join} slug={slug} />
    </main>
  );
}
