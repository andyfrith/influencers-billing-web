import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage(): React.JSX.Element {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] flex-1 flex-col">
      <SignUpForm />
    </main>
  );
}
