import { SignInForm } from "@/components/signIn/clubs/sign-in-form";
import { resolveClubLandingPageContent } from "@/lib/club-landing-resolution";
import { getDiscoverClubSlugParams } from "@/lib/discover-club-static-params";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getDiscoverClubSlugParams();
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const landing = await resolveClubLandingPageContent(slug);

  return (
    <main className="flex min-h-[calc(100dvh-5rem)] flex-1 flex-col">
      <SignInForm clubName={landing.name} loginContent={landing.login} slug={slug} />
    </main>
  );
}
