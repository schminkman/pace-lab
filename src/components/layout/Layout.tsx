// components/Layout.tsx

import { Navbar } from "./Navbar";

export function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="grow">{children}</main>
      {/* Optional Footer */}
    </div>
  );
}
