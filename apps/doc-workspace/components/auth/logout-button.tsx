"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMessages, type Locale } from "@/lib/i18n";

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = getMessages(locale);
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      router.push("/auth/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className="ghost-button" disabled={busy} onClick={handleLogout} type="button">
      {busy ? t.logout.signingOut : t.logout.signOut}
    </button>
  );
}
