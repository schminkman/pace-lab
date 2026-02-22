import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SyncButton } from "@/components/SyncButton";
import prisma from "@/lib/prisma";

// TODO fix darkmode styling
// TODO show last synced date.. may need a schema update
export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Fetch user's activities count
  const activityCount = await prisma.activity.count({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>{`Welcome, ${session.user?.name}!`}</p>
        <div className="space-y-4">
          <p className="text-gray-600 mt-2">
            {`Connected to Strava as ${session.user?.name}`}
          </p>
        </div>

        <div className="mt-8 shadow-md rounded-lg p-6 bg-accent">
          <div className="flex justify-between items-start">

            <h2 className="text-xl font-semibold mb-4">Your Activities</h2>
            <SyncButton />
          </div>
          {activityCount > 0 ?
              (
                <p>{`${activityCount} activities synced`}</p>
              ) :
              (
                <p>No activities synced yet. Click "Sync Activities" to get started.</p>
              )}
        </div>
      </div>
    </div>
  );
}
