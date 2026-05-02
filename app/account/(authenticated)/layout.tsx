import { requireSignedInPageSession } from "@/lib/authorization";

/**
 * Shared guard for account UI that requires a logged-in user.
 */
export default async function AccountAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  await requireSignedInPageSession();
  return children;
}
