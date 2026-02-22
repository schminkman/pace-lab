import type { Metadata } from "next";
import { geistMono, geistSans } from "@/app/fonts";

import { Layout } from "@/components/layout/Layout";
import { SessionProvider } from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pace Lab",
  description: "Pick up the pace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>

            <Layout>{children}</Layout>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
