"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DocumentForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"URL" | "FILE">("URL");
  const [title, setTitle] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("sourceType", mode);

      if (mode === "URL") {
        formData.append("externalUrl", externalUrl);
      } else if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create document.");
      }

      router.push(`/documents/${payload.document.id}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unknown error while creating document."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="segmented">
        <button type="button" className={mode === "URL" ? "active" : ""} onClick={() => setMode("URL")}>
          Paste URL
        </button>
        <button type="button" className={mode === "FILE" ? "active" : ""} onClick={() => setMode("FILE")}>
          Upload file
        </button>
      </div>

      <label className="field">
        <span>Document title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Procurement brief / Board pack / Policy update"
          required
        />
      </label>

      {mode === "URL" ? (
        <label className="field">
          <span>Public or signed URL</span>
          <input
            value={externalUrl}
            onChange={(event) => setExternalUrl(event.target.value)}
            placeholder="https://example.com/report.pdf"
            type="url"
            required
          />
        </label>
      ) : (
        <label className="field">
          <span>File</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.odt,.rtf,.xls,.xlsx"
            required
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={submitting} type="submit">
        {submitting ? "Creating workspace…" : "Create document workspace"}
      </button>
    </form>
  );
}
