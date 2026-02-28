"use client";

import type { SyncResponse } from "@/app/api/strava/sync/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SyncDirection } from "@/app/api/strava/sync/types";

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const { data: session } = useSession();
  const historyComplete = session?.user.historicalSyncComplete;

  const router = useRouter();

  const syncPages = async (direction: SyncDirection) => {
    let syncedCount = 0;
    let hasMore = true;
    const label =
      direction === SyncDirection.OLD ? "Syncing old" : "Syncing new";

    while (hasMore) {
      const response = await fetch("/api/strava/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });

      const result: SyncResponse = await response.json();

      // TODO really unsure what to do here.. need type narrow but also may or may not need to throw/early return?
      if (!result.success) {
        throw new Error("Sync failed");
      }

      syncedCount += result.count;
      hasMore = !result.done;
      setMessage(`${label} activities: ${syncedCount}...`);
    }

    return syncedCount;
  };

  const sync = async () => {
    setSyncing(true);
    setMessage("");

    try {
      let total = 0;

      if (!historyComplete) {
        total += await syncPages(SyncDirection.OLD);
      }

      total += await syncPages(SyncDirection.NEW);

      if (total > 0) {
        setMessage(`Synced ${total} activities`);
      } else {
        setMessage("Already up to date");
      }
      router.refresh();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to sync activities";
      setMessage(msg);
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  return { syncing, message, sync };
}
