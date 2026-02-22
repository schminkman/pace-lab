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
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p>{`Welcome, ${session.user?.name}!`}</p>
        <div className="space-y-4">
          <p className="mt-2 text-gray-600">
            {`Connected to Strava as ${session.user?.name}`}
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-accent p-6 shadow-md">
          <div className="flex items-start justify-between">

            <h2 className="mb-4 text-xl font-semibold">Your Activities</h2>
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
