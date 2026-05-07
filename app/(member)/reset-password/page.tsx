import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const token = params.token;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-sm text-destructive">Missing reset token.</p>
      )}
    </main>
  );
}
