import { cookies } from "next/headers";
import { getMessages, normalizeLocale } from "@/lib/i18n";

export async function getCurrentLocale() {
  const store = await cookies();
  return normalizeLocale(store.get("dw_locale")?.value);
}

export async function getCurrentMessages() {
  const locale = await getCurrentLocale();
  return {
    locale,
    t: getMessages(locale)
  };
}
