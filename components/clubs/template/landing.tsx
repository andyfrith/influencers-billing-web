import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClubLandingContent } from "@/data/clubs";
import Hero from "@/components/clubs/template/hero";
import Benefits from "@/components/clubs/template/benefits";
import Explore from "@/components/clubs/template/explore";
import Attention from "@/components/clubs/template/attention";
import Footer from "@/components/clubs/template/footer";
import {
  DEFAULT_LANDING_SECTION_ORDER,
  DEFAULT_LANDING_SECTION_VISIBILITY,
} from "@/data/club-landing-types";

export default function Landing({
  isAuthenticated,
  // features,
  clubLandingContent,
  // clubs,
}: {
  isAuthenticated: boolean;
  // features: Feature[];
  clubLandingContent: ClubLandingContent;
  // clubs: Club[];
}) {
  const sectionVisibility = {
    ...DEFAULT_LANDING_SECTION_VISIBILITY,
    ...(clubLandingContent.sections ?? {}),
  };
  const sectionOrder = clubLandingContent.sectionOrder ?? DEFAULT_LANDING_SECTION_ORDER;
  const sectionMap = {
    hero: <Hero hero={clubLandingContent.hero} />,
    benefits: <Benefits benefits={clubLandingContent.benefits} />,
    explore: <Explore explore={clubLandingContent.explore} />,
    attention: <Attention attention={clubLandingContent.attention} />,
  } as const;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* {isAuthenticated ? (
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-deepest/90 backdrop-blur">
          <div className="flex h-16 w-full items-center justify-between px-4 sm:px-5 md:px-6">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-[0.18em] text-accent"
            >
              Vanguard Club
            </Link>
            <nav className="hidden items-center gap-8 text-xs text-muted-foreground md:flex">
              <Link
                href="/clubs"
                className="transition-colors hover:text-foreground"
              >
                Clubs
              </Link>
              <Link
                href="/account/memberships"
                className="transition-colors hover:text-foreground"
              >
                Benefits
              </Link>
              <Link
                href="/account/billing"
                className="transition-colors hover:text-foreground"
              >
                Concierge
              </Link>
              <span className="text-accent">Memberships</span>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/account/billing"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Account
              </Link>
              <Link href="/clubs">
                <Button className="h-8 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary-hover">
                  Explore
                </Button>
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <div>Not logged in</div>
      )} */}

      {sectionOrder.map((key) => (sectionVisibility[key] ? <div key={key}>{sectionMap[key]}</div> : null))}
      <Footer clubName={clubLandingContent.name} />
    </main>
  );
}
