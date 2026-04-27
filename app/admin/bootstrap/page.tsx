import { AdminBootstrap } from "@/components/admin/admin-bootstrap";

export default function AdminBootstrapPage(): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Admin Bootstrap</h1>
      <p className="text-sm text-zinc-600">
        Use this page to promote the first admin user with your
        `ADMIN_BOOTSTRAP_KEY`.
      </p>
      <AdminBootstrap />
    </main>
  );
}
