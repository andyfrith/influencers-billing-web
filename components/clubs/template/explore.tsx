import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExploreContent } from "@/data/clubs";

export default function Explore({ explore }: { explore: ExploreContent }) {
  return (
    <section className="bg-muted py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-5 md:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">
              {explore.headline}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {explore.subheadline}
            </p>
          </div>
          <Link href={explore.cta.href}>
            <Button
              variant="outline"
              className="hidden rounded-full border-border bg-surface-container-low px-4 text-xs text-accent md:inline-flex"
            >
              {explore.cta.label}
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
              style={{
                backgroundImage: `url('${explore.items[0].image.src}')`,
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <p className="text-xs text-muted-foreground">
                {explore.items[0].preHeadline}
              </p>
              <h3 className="mt-1 text-3xl font-semibold text-foreground">
                {explore.items[0].headline}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {explore.items[0].subheadline}
              </p>
            </div>
          </article>
          {explore.items.slice(1).map((item) => (
            <article
              key={item.headline}
              className="relative min-h-[150px] overflow-hidden rounded-2xl border border-border"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${item.image.src}')` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 p-4">
                <p className="text-xs text-muted-foreground">
                  {item.preHeadline}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {item.headline}
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
  );
}
