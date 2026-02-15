import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read,activity:read_all",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.stravaId = user.stravaId;
      }
      return session;
    },
    async signIn({ user, account }) {
      // TODO is this actualy neceessary? Or can we get away with just having it on the Account.. and potentially also the session?
      // Update the user's User.stravaId field for easier querying later on
      if (
        account?.provider === "strava" &&
        account.providerAccountId &&
        !user.stravaId
      ) {
        // Only update if stravaId is not already set
        await prisma.user.update({
          where: { id: user.id },
          data: { stravaId: Number.parseInt(account.providerAccountId) },
        });
      }
      return true;
    },
  },
});
