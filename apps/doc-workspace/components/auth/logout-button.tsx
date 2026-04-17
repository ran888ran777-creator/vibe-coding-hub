"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
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
      {busy ? "Signing out..." : "Sign out"}
    </button>
  );
}
