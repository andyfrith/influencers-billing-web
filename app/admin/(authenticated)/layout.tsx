import { requireAdminPageSession } from "@/lib/authorization";

/**
 * Guards all admin UI routes in this segment; `/admin/bootstrap` stays outside for key-based setup.
 */
export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  await requireAdminPageSession();
  return children;
}
