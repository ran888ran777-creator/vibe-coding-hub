"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getMessages, type Locale } from "@/lib/i18n";

export function DocumentForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = getMessages(locale);
  const [mode, setMode] = useState<"URL" | "FILE">("URL");
  const [pdfParseMode, setPdfParseMode] = useState<"AUTO" | "OCR" | "FAST">("AUTO");
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
      formData.append("pdfParseMode", pdfParseMode);

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
          {t.actions.pasteUrl}
        </button>
        <button type="button" className={mode === "FILE" ? "active" : ""} onClick={() => setMode("FILE")}>
          {t.actions.uploadFile}
        </button>
      </div>

      <label className="field">
        <span>{t.actions.title}</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t.actions.titlePlaceholder}
          required
        />
      </label>

      {mode === "URL" ? (
        <label className="field">
          <span>{t.actions.url}</span>
          <input
            value={externalUrl}
            onChange={(event) => setExternalUrl(event.target.value)}
            placeholder={t.actions.urlPlaceholder}
            type="url"
            required
          />
        </label>
      ) : (
        <label className="field">
          <span>{t.actions.file}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.odt,.rtf,.xls,.xlsx"
            required
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
      )}

      <label className="field">
        <span>{t.actions.pdfMode}</span>
        <select
          value={pdfParseMode}
          onChange={(event) => setPdfParseMode(event.target.value as "AUTO" | "OCR" | "FAST")}
        >
          <option value="AUTO">{t.actions.auto}</option>
          <option value="OCR">{t.actions.ocr}</option>
          <option value="FAST">{t.actions.fast}</option>
        </select>
        <span className="muted-note">{t.actions.pdfModeHint}</span>
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={submitting} type="submit">
        {submitting ? t.actions.creatingWorkspace : t.actions.createWorkspace}
      </button>
    </form>
  );
}
