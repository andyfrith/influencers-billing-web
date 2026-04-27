import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage(): React.JSX.Element {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <SignInForm />
    </main>
  );
}
