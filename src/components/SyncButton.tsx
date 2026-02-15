"use client";

import { useState } from "react";
import { Button } from "./ui/button";

// TODO the message / button may need some updated styling.. do we need state for showButton?
export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  // This bool will need to be based on some db state (are we up to date?)
  const [showButton, setShowButton] = useState(true);

  const handleSync = async () => {
    setSyncing(true);
    setMessage("");

    try {
      const response = await fetch("/api/strava/sync", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Use the message from API
        // Only refresh if we actually synced new activities
        if (data.synced > 0) {
          setTimeout(() => window.location.reload(), 1500);
          setShowButton(false);
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("✗ Failed to sync activities");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {showButton && (
        <Button disabled={syncing} onClick={handleSync}>
          {syncing ? "Syncing..." : "Sync Activities"}
        </Button>
      )}
      {message && (
        <span className={message.startsWith("✓") ? "text-green-600" : "text-red-600"}>
          {message}
        </span>
      )}
    </div>
  );
}
