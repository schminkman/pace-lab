import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ensureValidStravaToken } from "@/lib/strava";

// TODO right now you click sync, then this syncs up to 200 activities. Then you must continue to click sync
// and this will continue to sync backwards in time until all activities have been synced. But what about new activities?
// Do we need to track whether all activities have been synced? We can use the webhook to subscribe to new activities etc.
// We can also have a sync new activities button that synces after latest stored activity.
// ! problem is that right now you have to sync both backwards (initially due to 200 limit w/ timeout concern)
// ! and then you also need the abilty to sync forward (future sync)
export async function POST() {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureValidStravaToken(session.user.id);

    // Get User's strava access token from Account table
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "strava",
      },
    });

    // TODO is this necessary?
    if (!account || !account.access_token) {
      return NextResponse.json({
        error: "Strava account not connected",
      });
    }

    // TODO webhook subscribe to activity updates instead of polling / checking manually
    // https://developers.strava.com/docs/getting-started/ section F
    // Get the most recent activity to determine where to start syncing
    const mostRecentActivity = await prisma.activity.findFirst({
      where: { userId: session.user.id },
      orderBy: { startDate: "asc" },
      select: { startDate: true },
    });

    // Convert to Unix timestamp (Strava uses epoch seconds)
    const beforeTimestamp = mostRecentActivity ?
        Math.floor(mostRecentActivity.startDate.getTime() / 1000) :
      undefined;

    // Fetch activities from Strava (only new ones if we have existing data)
    const allActivities = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && allActivities.length < 200) {
      // Limit to 200 activities per sync to avoid timeouts
      const url = new URL("https://www.strava.com/api/v3/athlete/activities");
      url.searchParams.append("per_page", "50"); // 50 activity chunks
      url.searchParams.append("page", page.toString());
      if (beforeTimestamp) {
        url.searchParams.append("before", beforeTimestamp.toString());
      }

      const stravaResponse = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      });

      console.log(stravaResponse);

      if (!stravaResponse.ok) {
        throw new Error(`Strava API error: ${stravaResponse.status}`);
      }

      const activities = await stravaResponse.json();

      if (activities.length === 0) {
        hasMore = false;
      } else {
        allActivities.push(...activities);
        page++;
      }
    }

    // 5. Save activities to database
    let syncedCount = 0;
    for (const activity of allActivities) {
      await prisma.activity.upsert({
        where: { stravaId: BigInt(activity.id) },
        update: {
          name: activity.name,
          type: activity.type,
          sportType: activity.sport_type,
          startDate: new Date(activity.start_date),
          timezone: activity.timezone,
          distance: activity.distance,
          movingTime: activity.moving_time,
          elapsedTime: activity.elapsed_time,
          elevationGain: activity.total_elevation_gain,
          averageSpeed: activity.average_speed,
          maxSpeed: activity.max_speed,
          averageHeartrate: activity.average_heartrate,
          maxHeartrate: activity.max_heartrate,
          averageCadence: activity.average_cadence,
          kudosCount: activity.kudos_count,
          hasHeartrate: activity.has_heartrate,
        },
        create: {
          stravaId: BigInt(activity.id),
          userId: session.user.id,
          name: activity.name,
          type: activity.type,
          sportType: activity.sport_type,
          startDate: new Date(activity.start_date),
          timezone: activity.timezone,
          distance: activity.distance,
          movingTime: activity.moving_time,
          elapsedTime: activity.elapsed_time,
          elevationGain: activity.total_elevation_gain,
          averageSpeed: activity.average_speed,
          maxSpeed: activity.max_speed,
          averageHeartrate: activity.average_heartrate,
          maxHeartrate: activity.max_heartrate,
          averageCadence: activity.average_cadence,
          kudosCount: activity.kudos_count,
          hasHeartrate: activity.has_heartrate,
        },
      });
      syncedCount++;
    }

    const isInitialSync = !mostRecentActivity;
    const message = isInitialSync ?
      `Initial sync complete: ${syncedCount} activities` :
      syncedCount > 0 ?
        `Synced ${syncedCount} new activities` :
        "No new activities to sync";

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      message,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync activities" },
      { status: 500 },
    );
  }
}
