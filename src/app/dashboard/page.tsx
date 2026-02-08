import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session.user?.name}!</p>
      <div className="space-y-4">
        <p className="text-gray-600 mt-2">
          Connected to Strava as {session.user?.name}
        </p>
        <SignOutButton />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Activities</h2>
        <p className="text-gray-500">No activities synced yet</p>
      </div>
    </div>
  );
}
