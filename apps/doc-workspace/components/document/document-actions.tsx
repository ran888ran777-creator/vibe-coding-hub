"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMessages, type Locale } from "@/lib/i18n";

type DocumentStatusValue = "UPLOADED" | "PARSING" | "PARSED" | "SUMMARIZING" | "READY" | "FAILED";

export function DocumentActions({
  documentId,
  locale,
  status
}: {
  documentId: string;
  locale: Locale;
  status: DocumentStatusValue;
}) {
  const router = useRouter();
  const t = getMessages(locale);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "PARSING" && status !== "SUMMARIZING") {
      return;
    }

    const timer = window.setInterval(() => {
      router.refresh();
    }, 2500);

    return () => window.clearInterval(timer);
  }, [router, status]);

  async function runAction(action: "parse" | "summary" | "export-markdown" | "export-json") {
    setBusyAction(action);
    setMessage(null);

    try {
      const response = await fetch(
        action === "parse"
          ? `/api/documents/${documentId}/parse`
          : action === "summary"
            ? `/api/documents/${documentId}/summary`
            : `/api/documents/${documentId}/export`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body:
            action.startsWith("export")
              ? JSON.stringify({ format: action === "export-markdown" ? "MARKDOWN" : "JSON" })
              : undefined
        }
      );

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Action failed.");
      }

      if (payload.download) {
        const blob = new Blob([payload.payload], {
          type: action === "export-markdown" ? "text/markdown" : "application/json"
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = payload.download;
        link.click();
      }

      setMessage(payload.message ?? (action === "parse" || action === "summary" ? "Job queued." : "Done."));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown action error.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="panel">
      <div className="action-grid">
        <button onClick={() => runAction("parse")} disabled={busyAction !== null || status === "PARSING"}>
          {busyAction === "parse" ? t.actions.queueing : t.actions.runParse}
        </button>
        <button
          onClick={() => runAction("summary")}
          disabled={busyAction !== null || (status !== "PARSED" && status !== "READY")}
        >
          {busyAction === "summary" ? t.actions.queueing : t.actions.generateSummary}
        </button>
        <button onClick={() => runAction("export-markdown")} disabled={busyAction !== null || status === "UPLOADED"}>
          {t.actions.exportMd}
        </button>
        <button onClick={() => runAction("export-json")} disabled={busyAction !== null || status === "UPLOADED"}>
          {t.actions.exportJson}
        </button>
      </div>
      {message ? <p className="muted-note">{message}</p> : null}
    </div>
  );
}
