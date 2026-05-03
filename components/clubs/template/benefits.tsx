import { BenefitsContent } from "@/data/clubs";

export default function Benefits({ benefits }: { benefits: BenefitsContent }) {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-5 md:px-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-foreground">
          {benefits.headline}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          {benefits.subheadline}
        </p>
      </div>
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {benefits.items.map((feature) => (
          <article
            key={feature.headline}
            className="overflow-hidden rounded-2xl border border-border bg-surface-panel"
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url('${feature.image.src}')` }}
            />
            <article className="rounded-b-2xl border-t border-border bg-card p-4">
              <span className="material-symbols-outlined rounded bg-muted p-1 text-sm text-primary">
                {feature.icon}
              </span>
              <h3 className="mt-3 text-lg font-medium text-foreground">
                {feature.headline}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.subheadline}
              </p>
            </article>
          </article>
        ))}
      </div>
    </section>
  );
}
