import prisma from "./prisma";

// Necessary to support the refresh token cycle which is not supported by next-auth out of the box
export async function ensureValidStravaToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "strava",
    },
  });

  // TODO is this necessary?
  if (!account) {
    throw new Error("No Strava account connected");
  }

  const now = Math.floor(Date.now() / 1000);
  const isExpired = account.expires_at && account.expires_at < now;

  if (!isExpired && account.access_token) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error("STRAVA_NOT_CONNECTED");
  }

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID!,
      client_secret: process.env.STRAVA_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
  });

  if (!response.ok) {
    // Refresh token is invalid - user needs to reconnect
    throw new Error("STRAVA_REAUTH_REQUIRED");
  }

  const data = await response.json();

  await prisma.account.update({
    where: { id: account.id },
    data: {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    },
  });
}
