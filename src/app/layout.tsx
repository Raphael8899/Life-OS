import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { NowRunningWidget } from "@/components/NowRunningWidget";

export const metadata: Metadata = { title: "LifeOS", description: "LifeOS - chart driven personal operating system" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
          <NowRunningWidget />
        </div>
      </body>
    </html>
  );
}
