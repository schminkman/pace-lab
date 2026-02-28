"use client";

import type { ComponentProps } from "react";
import { SessionProvider as AuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children, ...props }: ComponentProps<typeof AuthSessionProvider>) {
  return (<AuthSessionProvider {...props}>{children}</AuthSessionProvider>);
}
