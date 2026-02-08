import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/SignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  console.log(session);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Pace Lab</h1>
        <div className="space-y-4">
          <p>Connect your Strava account to get started</p>
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
