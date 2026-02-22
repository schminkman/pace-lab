import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/SignInButton";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="mb-8 text-4xl font-bold">Pace Lab</h1>
        <div className="space-y-4">
          <p>Connect your Strava account to get started</p>
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
