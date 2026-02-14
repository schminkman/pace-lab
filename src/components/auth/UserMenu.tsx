import { SignOutButton } from "./SignOutButton";
import { auth } from "@/auth";

export async function UserMenu() {
  const session = await auth();

  if (!session) return null;

  return <SignOutButton />;
}
