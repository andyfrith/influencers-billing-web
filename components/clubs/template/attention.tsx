import { AttentionContent } from "@/data/clubs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function Attention({
  attention,
}: {
  attention: AttentionContent;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-5 md:px-6">
      <div className="rounded-3xl border border-border bg-linear-to-r from-muted to-surface-container-low px-8 py-10 text-center">
        <h2 className="text-4xl font-semibold text-foreground">
          {attention.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          {attention.subheadline}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {attention.cta.items.map((item, idx) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant={idx === 0 ? "default" : "outline"}
                className={clsx(
                  "h-10 rounded-full px-6 text-sm font-semibold",
                  {
                    "bg-primary text-primary-foreground hover:bg-primary-hover":
                      idx === 0,
                    "border-border bg-background/30 text-foreground hover:bg-muted/40":
                      idx === 1,
                  },
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          {/* {isAuthenticated ? (
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
        )} */}
        </div>
      </div>
    </section>
  );
}
