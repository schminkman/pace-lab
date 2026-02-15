import { auth } from "@/auth";
import { SignOutButton } from "./SignOutButton";

export async function UserMenu() {
  const session = await auth();

  if (!session)
    return null;

  return <SignOutButton />;
}
