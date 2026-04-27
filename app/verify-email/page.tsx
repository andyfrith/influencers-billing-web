import { VerifyEmailStatus } from "@/components/auth/verify-email-status";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const token = params.token;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      {token ? (
        <VerifyEmailStatus token={token} />
      ) : (
        <p className="text-sm text-red-600">Missing verification token.</p>
      )}
    </main>
  );
}
