import { getMessages, type Locale } from "@/lib/i18n";

type DocumentStatusValue = "UPLOADED" | "PARSING" | "PARSED" | "SUMMARIZING" | "READY" | "FAILED";

export function StatusBadge({ status, locale }: { status: DocumentStatusValue; locale: Locale }) {
  const t = getMessages(locale);
  return <span className={`status status-${status.toLowerCase()}`}>{t.status[status]}</span>;
}
