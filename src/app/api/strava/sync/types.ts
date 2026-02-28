import { NextResponse } from "next/server";

// TODO do we really need this success? we need some discriminant field...
export type SyncResponse = { success: false; error: string; } |
  { success: true; count: number; done: boolean; };

export function syncResponse(data: SyncResponse, status = 200) {
  return NextResponse.json(data, { status });
}

export enum SyncDirection {
  OLD = "old",
  NEW = "new",
};

export type SyncRequest = {
  pageNumber: number;
  direction: SyncDirection;
};
