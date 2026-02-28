/* eslint-disable ts/consistent-type-definitions */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      historicalSyncComplete: boolean;
      lastSyncedAt: Date | null;
    } & DefaultSession["user"];
  }
}
