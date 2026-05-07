export default function Footer({ clubName }: { clubName: string }) {
  return (
    <footer className="border-t border-border-subtle py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 text-xs text-muted-foreground/80 sm:px-5 md:flex-row md:items-center md:px-6">
        <span className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {clubName} Club
        </span>
        <div className="flex gap-4">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}

{
  /* <footer className="border-t border-border-subtle bg-surface-deepest py-7">
        <div className="flex w-full flex-col gap-4 px-4 text-muted-foreground/80 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Vanguard Club
            </p>
            <p className="mt-2 text-xs">
              © 2024 VANGUARD CLUB. THE PINNACLE OF EXCLUSIVITY.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.12em]">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Membership Rules</span>
            <span>Contact</span>
          </div>
        </div>
      </footer> */
}
