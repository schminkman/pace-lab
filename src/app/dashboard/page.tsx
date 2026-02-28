import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SyncButton } from "@/components/SyncButton";
import prisma from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Fetch user's activities count
  const activityCount = await prisma.activity.count({
    where: { userId: session.user.id },
  });

  const lastSyncedAt = session.user.lastSyncedAt ?
      timeAgo(new Date(session.user.lastSyncedAt)) :
    "never";

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <div className="space-y-4">
          <p className="mt-2 opacity-75">
            {`Connected to Strava as ${session.user?.name}`}
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-accent p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Your Activities</h2>
              <span className="text-sm opacity-75">{`Last Synced: ${lastSyncedAt}`}</span>
            </div>
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
