"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export function SignOutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
      <LogOut />
      Log Out
    </Button>
  );
}
