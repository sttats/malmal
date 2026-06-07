import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AuthHashHandler } from "@/components/auth-hash-handler";
import { BottomNav } from "@/components/bottom-nav";

import "./globals.css";

export const metadata: Metadata = {
  title: "malmal",
  description: "YouTube風の動画リンク共有MVP"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className="bg-paper text-ink antialiased">
        <div className="min-h-screen bg-paper">
          <AuthHashHandler />
          <main className="mx-auto min-h-screen max-w-5xl px-4 pb-28 pt-3 md:px-6">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
