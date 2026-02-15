/* eslint-disable next/no-img-element */
"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <a onClick={() => signIn("strava", { callbackUrl: "/" })}>
      <img src="/btn_strava_connect_with_orange.svg" alt="Connect with Strava" height={48} />
    </a>
  );
}
