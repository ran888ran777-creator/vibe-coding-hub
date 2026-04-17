import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doc Workspace",
  description: "Production-minded AI document parsing workspace powered by Firecrawl."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

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
              {user ? (
                <>
                  <Link href="/dashboard">Dashboard</Link>
                  <Link href="/documents/new">New document</Link>
                  <Link href="/settings">Settings</Link>
                  <span className="meta nav-user">{user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/auth/login">Sign in</Link>
                  <Link href="/auth/register">Register</Link>
                </>
              )}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
