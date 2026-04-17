"use client";

import { useState } from "react";
import { getMessages, type Locale } from "@/lib/i18n";

export function AskForm({
  documentId,
  locale,
  disabled = false
}: {
  documentId: string;
  locale: Locale;
  disabled?: boolean;
}) {
  const t = getMessages(locale);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${documentId}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to answer question.");
      }

      setAnswer(payload.answer);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unknown question error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <form className="ask-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>{t.actions.askDocument}</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={disabled}
            rows={5}
            placeholder={t.actions.askPlaceholder}
          />
        </label>
        <button className="primary-button" disabled={disabled || busy || question.length < 3} type="submit">
          {busy ? t.actions.thinking : t.actions.ask}
        </button>
      </form>

      {disabled ? <p className="muted-note">{t.actions.waitUntilReady}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {answer ? <pre className="answer-box">{answer}</pre> : null}
    </div>
  );
}
