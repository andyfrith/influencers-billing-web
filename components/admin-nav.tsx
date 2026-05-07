import Link from "next/link";

type AdminNavProps = {
  clubId?: string;
};

export function AdminNav({ clubId }: AdminNavProps): React.JSX.Element {
  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <Link href="/admin" className="underline">
        Overview
      </Link>
      <Link href="/admin/clubs" className="underline">
        Clubs
      </Link>
      <Link href="/admin/clubs/new" className="underline">
        Create club
      </Link>
      {clubId ? (
        <>
          <Link href={`/admin/clubs/${clubId}`} className="underline">
            Overview
          </Link>
          <Link href={`/admin/clubs/${clubId}/landing`} className="underline">
            Landing page
          </Link>
          <Link href={`/admin/clubs/${clubId}/plans`} className="underline">
            Plans
          </Link>
        </>
      ) : null}
      <Link href="/admin/cancellation-requests" className="underline">
        Cancellation requests
      </Link>
      <Link href="/admin/members" className="underline">
        Members
      </Link>
      <Link href="/admin/concierges" className="underline">
        Concierges
      </Link>
    </nav>
  );
}
