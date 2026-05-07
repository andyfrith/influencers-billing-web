import clsx from "clsx";
import Link from "next/link";
import { HeroContent } from "@/data/clubs";
import { Button } from "@/components/ui/button";

export default function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url(${hero.backgroundImage.src})`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-surface-deepest/80 via-surface-deepest/60 to-background" />
      <div className="relative mx-auto flex min-h-[460px] w-full max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-5 md:px-6">
        <div className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1 text-[10px] uppercase tracking-[0.16em] text-primary">
          {hero.tagline}
        </div>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
          Access the{" "}
          <span className="text-primary">
            {hero.headline.split(" ")[hero.headline.split(" ").length - 1]}
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
          {hero.subheadline}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {hero.cta.items.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant={item.label === "Explore Clubs" ? "outline" : "default"}
                className={clsx(
                  `h-10 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground`,
                  {
                    "h-10 rounded-full border-border bg-background/30 px-7 text-sm text-foreground hover:bg-muted/40":
                      item.label === "Explore Clubs",
                  },
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          {/* <Link href={isAuthenticated ? "/clubs" : "/sign-up"}>
              <Button className="h-10 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                {clubLandingContent.hero.cta.items[0].label}
              </Button>
            </Link>
            <Link href="/clubs">
              <Button
                variant="outline"
                className="h-10 rounded-full border-border bg-background/30 px-7 text-sm text-foreground hover:bg-muted/40"
              >
                {clubLandingContent.hero.cta.items[1].label}
              </Button>
            </Link> */}
        </div>
      </div>
    </section>
  );
}
