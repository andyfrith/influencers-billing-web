import Link from "next/link";

type AdminNavProps = {
  clubId?: string;
};

export function AdminNav({ clubId }: AdminNavProps): React.JSX.Element {
  return (
    <nav className="flex flex-wrap gap-4 text-sm">
      <Link href="/admin" className="underline">
        Overview
      </Link>
      <Link href="/admin/clubs" className="underline">
        Clubs
      </Link>
      <Link href="/admin/cancellation-requests" className="underline">
        Cancellation requests
      </Link>
      {clubId ? (
        <Link href={`/admin/clubs/${clubId}/plans`} className="underline">
          Club plans
        </Link>
      ) : null}
    </nav>
  );
}
