import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentMessages } from "@/lib/i18n-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doc Workspace",
  description: "Production-minded AI document parsing workspace powered by Firecrawl."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const { locale, t } = await getCurrentMessages();

  return (
    <html lang={locale}>
      <body>
        <div className="shell">
          <header className="site-header">
            <div className="brand">
              <span className="brand-mark">DW</span>
              <div className="brand-copy">
                <strong>{t.appName}</strong>
                <span>{t.appTagline}</span>
              </div>
            </div>
            <nav className="top-nav">
              <LanguageSwitcher locale={locale} />
              <Link href="/">{t.nav.home}</Link>
              {user ? (
                <>
                  <Link href="/dashboard">{t.nav.dashboard}</Link>
                  <Link href="/documents/new">{t.nav.newDocument}</Link>
                  <Link href="/settings">{t.nav.settings}</Link>
                  <span className="meta nav-user">{user.email}</span>
                  <LogoutButton locale={locale} />
                </>
              ) : (
                <>
                  <Link href="/auth/login">{t.nav.signIn}</Link>
                  <Link href="/auth/register">{t.nav.register}</Link>
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
