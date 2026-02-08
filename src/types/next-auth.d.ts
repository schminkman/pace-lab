import { DefaultSession } from "next-auth";

// TODO is this necessary?
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    stravaId?: number;
  }
}
