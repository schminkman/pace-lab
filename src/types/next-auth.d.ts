import type { DefaultSession } from "next-auth";

// TODO is this necessary?
declare module "next-auth" {
  type Session = {
    user: {
      id: string;
    } & DefaultSession["user"];
  };

  type User = {
    stravaId?: number;
  };
}
