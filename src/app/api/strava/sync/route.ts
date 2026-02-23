import type { NextRequest } from "next/server";
import type { SyncRequest } from "./types";
import type { StravaActivity } from "@/lib/schemas/stravaActivity.schema";
import z from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { $StravaActivitySchema } from "@/lib/schemas/stravaActivity.schema";
import { ensureValidStravaToken } from "@/lib/strava";
import { SYNC_PAGE_SIZE } from "./constants";
import { SyncDirection, syncResponse } from "./types";

/*
Core Strava Sync route. Expercts the body to be of type SyncRequest.

- The current flow is quite a bit hackey (for various reasons including timeout concerns).
  This could probably be improved even while respecting these constraints. Potentially worth moving some logic to the useSync hook.

  The core logic is this: request contains direction which is used to build the strava api query.
  If SyncDirection.OLD, get earliest activity and use before query param.
  If SyncDirection.NEW get latest activity and use after query param.
  We use a sort of client-side pagination / chunking but every query is for page 1 (as anchorActivity updates with each query).
  There is a client-side loop that executes until this request returns < SYNC_PAGE_SIZE activities.
*/
export async function POST(request: NextRequest) {
  try {
    // TODO can we move auth check / token refresh to a utility file?
    const session = await auth();
    const { direction } = await request.json() as SyncRequest;

    // Check if user is authenticated
    if (!session?.user?.id) {
      return syncResponse({ success: false, error: "Unauthorized" }, 401);
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
      return syncResponse({
        success: false,
        error: "Strava account not connected",
      }, 401);
    }

    // Direction determines which activity to anchor from and which Strava param to use
    const anchorActivity = await prisma.activity.findFirst({
      where: { userId: session.user.id },
      orderBy: { startDate: direction === SyncDirection.OLD ? "asc" : "desc" },
      select: { startDate: true },
    });

    // Convert to Unix timestamp (Strava uses epoch seconds)
    const timestamp = anchorActivity ?
        Math.floor(anchorActivity.startDate.getTime() / 1000) :
      undefined;

    // Always request page 1 (the default) as anchorActivity will update with each call.
    const url = new URL("https://www.strava.com/api/v3/athlete/activities");
    url.searchParams.append("per_page", SYNC_PAGE_SIZE.toString()); // 50 activity chunks
    if (timestamp) {
      url.searchParams.append(direction === SyncDirection.OLD ? "before" : "after", timestamp.toString());
    }

    const stravaResponse = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
      },
    });

    if (!stravaResponse.ok) {
      throw new Error(`Strava API error: ${stravaResponse.status}`);
    }

    const data = await stravaResponse.json();
    const activities: StravaActivity[] = z.array($StravaActivitySchema).parse(data);

    // Save to db with upserts
    await prisma.$transaction(
      activities.map((activity: StravaActivity) =>
        prisma.activity.upsert({
          where: { stravaId: BigInt(activity.id) },
          update: {
            name: activity.name,
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
            kudosCount: activity.kudos_count,
            hasHeartrate: activity.has_heartrate,
          },
          create: {
            stravaId: BigInt(activity.id),
            userId: session.user.id,
            name: activity.name,
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
            kudosCount: activity.kudos_count,
            hasHeartrate: activity.has_heartrate,
          },
        }),
      ),
    );

    const done = activities.length < SYNC_PAGE_SIZE;

    // If done syncing old activities update historicalSyncComplete
    if (done) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          lastSyncedAt: new Date(),
          ...(direction === SyncDirection.OLD && { historicalSyncComplete: true }),
        },
      });
    }

    return syncResponse({
      success: true,
      count: activities.length,
      done,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return syncResponse(
      { success: false, error: "Failed to sync activities" },
      500,
    );
  }
}
