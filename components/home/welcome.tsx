import Link from "next/link";
import { Button } from "@/components/ui/button";

type Feature = {
  icon: string;
  title: string;
  description: string;
  imageUrl: string;
};

type Club = {
  category: string;
  name: string;
  description: string;
  imageUrl: string;
};

export default function Welcome({
  isAuthenticated,
  features,
  clubs,
}: {
  isAuthenticated: boolean;
  features: Feature[];
  clubs: Club[];
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {isAuthenticated ? (
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
      ) : null}

      <section className="relative overflow-hidden border-b border-border-subtle">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface-deepest/80 via-surface-deepest/60 to-background" />
        <div className="relative mx-auto flex min-h-[460px] w-full max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-5 md:px-6">
          <div className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1 text-[10px] uppercase tracking-[0.16em] text-primary">
            The Future of Membership
          </div>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Access the <span className="text-primary">Extraordinary</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
            Join world-class innovators, wellness leaders, and creators. Elevate
            your lifestyle with curated access to the most exclusive communities
            and experiences around the globe.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={isAuthenticated ? "/clubs" : "/sign-up"}>
              <Button className="h-10 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                Join the Vanguard
              </Button>
            </Link>
            <Link href="/clubs">
              <Button
                variant="outline"
                className="h-10 rounded-full border-border bg-background/30 px-7 text-sm text-foreground hover:bg-muted/40"
              >
                Explore Clubs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-5 md:px-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground">
            Redefining Premium Living
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Every membership is a passport to unmatched privileges and
            meaningful connections.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="overflow-hidden rounded-2xl border border-border bg-surface-panel"
            >
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url('${feature.imageUrl}')` }}
              />
              <article className="rounded-b-2xl border-t border-border bg-card p-4">
                <span className="material-symbols-outlined rounded bg-muted p-1 text-sm text-primary">
                  {feature.icon}
                </span>
                <h3 className="mt-3 text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-5 md:px-6">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                Explore Our Communities
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                From wellness and innovation to hospitality and fine dining,
                find the club that reflects your ambitions.
              </p>
            </div>
            <Link href="/clubs">
              <Button
                variant="outline"
                className="hidden rounded-full border-border bg-surface-container-low px-4 text-xs text-accent md:inline-flex"
              >
                Discover More
                <span className="material-symbols-outlined ml-1 text-sm">
                  arrow_forward
                </span>
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <article className="relative min-h-[320px] overflow-hidden rounded-2xl border border-border md:col-span-2 md:row-span-2">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${clubs[0].imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <p className="text-xs text-muted-foreground">
                  {clubs[0].category}
                </p>
                <h3 className="mt-1 text-3xl font-semibold text-foreground">
                  {clubs[0].name}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {clubs[0].description}
                </p>
              </div>
            </article>
            {clubs.slice(1).map((club) => (
              <article
                key={club.name}
                className="relative min-h-[150px] overflow-hidden rounded-2xl border border-border"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${club.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="text-xs text-muted-foreground">
                    {club.category}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">
                    {club.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 md:hidden">
            <Link href="/clubs">
              <Button
                variant="outline"
                className="rounded-full border-border bg-surface-container-low px-4 text-xs text-accent"
              >
                Discover More
                <span className="material-symbols-outlined ml-1 text-sm">
                  arrow_forward
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-5 md:px-6">
        <div className="rounded-3xl border border-border bg-linear-to-r from-muted to-surface-container-low px-8 py-10 text-center">
          <h2 className="text-4xl font-semibold text-foreground">
            Your Seat is Reserved
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Application for membership is now open. Join the next generation of
            global leadership and claim your place in the Vanguard.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/clubs">
                  <Button className="h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                    Apply for Membership
                  </Button>
                </Link>
                <Link href="/account/billing">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-border bg-transparent px-6 text-sm text-foreground"
                  >
                    Manage Billing
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className="h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                    Apply for Membership
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-border bg-transparent px-6 text-sm text-foreground"
                  >
                    Speak with an Advisor
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 text-xs text-muted-foreground/80 sm:px-5 md:flex-row md:items-center md:px-6">
          <span className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Vanguard Club
          </span>
          <div className="flex gap-4">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
