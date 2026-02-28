import Link from "next/link";
import { UserMenu } from "../auth/UserMenu";
import { ModeToggle } from "./ModeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}

        <Link href="/" className="text-2xl font-bold">
          Pace Lab
        </Link>

        {/* Navigation Links (Desktop) */}

        <div className="flex items-center gap-5">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
