"use client";

import { useSession } from "next-auth/react";
import { useSync } from "@/hooks/useSync";
import { Button } from "./ui/button";

export function SyncButton() {
  const { data: session } = useSession();
  const { syncing, message, sync } = useSync();

  if (!session) {
    return null;
  }

  return (
    <div className="relative flex flex-col items-center">
      <Button variant="strava" disabled={syncing} onClick={sync}>
        {syncing ? "Syncing..." : "Sync Activities"}
      </Button>
      <span className={`absolute top-full mt-2 text-sm whitespace-nowrap ${message ? "" : "invisible"} ${message.startsWith("Synced") ? "text-green-600" : ""}`}>
        {message}
      </span>
    </div>
  );
}
