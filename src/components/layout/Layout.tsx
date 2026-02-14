// components/Layout.tsx

import { Navbar } from "./Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // If using shadcn dark mode, ensure ThemeProvider is in the root layout (app/layout.tsx)
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">{children}</main>
      {/* Optional Footer */}
    </div>
  );
}
