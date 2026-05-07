import { AuthenticatedSiteHeader } from "@/components/authenticated/authenticated-site-header";

export function AuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AuthenticatedSiteHeader />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
