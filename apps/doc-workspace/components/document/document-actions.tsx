"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DocumentActions({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

      setMessage(payload.message ?? "Done.");
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
        <button onClick={() => runAction("parse")} disabled={busyAction !== null}>
          {busyAction === "parse" ? "Parsing…" : "Run parse"}
        </button>
        <button onClick={() => runAction("summary")} disabled={busyAction !== null}>
          {busyAction === "summary" ? "Summarizing…" : "Generate summary"}
        </button>
        <button onClick={() => runAction("export-markdown")} disabled={busyAction !== null}>
          Export .md
        </button>
        <button onClick={() => runAction("export-json")} disabled={busyAction !== null}>
          Export .json
        </button>
      </div>
      {message ? <p className="muted-note">{message}</p> : null}
    </div>
  );
}
