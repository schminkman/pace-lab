import type { Metadata } from "next";
import { geistMono, geistSans } from "@/app/fonts";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
