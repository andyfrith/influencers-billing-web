export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-border-subtle py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 text-xs text-muted-foreground/80 sm:px-5 md:flex-row md:items-center md:px-6">
        <span className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {name} Club
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
