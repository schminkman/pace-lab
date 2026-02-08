"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign Out
    </button>
  );
}
