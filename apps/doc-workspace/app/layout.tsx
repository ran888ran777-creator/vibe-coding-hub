import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doc Workspace",
  description: "Production-minded AI document parsing workspace powered by Firecrawl."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="site-header">
            <div className="brand">
              <span className="brand-mark">DW</span>
              <div className="brand-copy">
                <strong>Doc Workspace</strong>
                <span>Parse, inspect, summarize, and export documents.</span>
              </div>
            </div>
            <nav className="top-nav">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/documents/new">New document</Link>
              <Link href="/settings">Settings</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
