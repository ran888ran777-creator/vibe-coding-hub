"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    setBusy(true);
    try {
      await fetch("/api/preferences/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ locale: nextLocale })
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="language-switcher" aria-label="Language switcher">
      <button
        className={locale === "en" ? "active" : ""}
        disabled={busy}
        onClick={() => setLocale("en")}
        type="button"
      >
        EN
      </button>
      <button
        className={locale === "ru" ? "active" : ""}
        disabled={busy}
        onClick={() => setLocale("ru")}
        type="button"
      >
        RU
      </button>
    </div>
  );
}
