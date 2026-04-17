"use client";

import { useState } from "react";

export function AskForm({ documentId }: { documentId: string }) {
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
          <span>Ask the document</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={5}
            placeholder="What are the deadlines, obligations, owners, or key decisions?"
          />
        </label>
        <button className="primary-button" disabled={busy || question.length < 3} type="submit">
          {busy ? "Thinking…" : "Ask"}
        </button>
      </form>

      {error ? <p className="error-text">{error}</p> : null}
      {answer ? <pre className="answer-box">{answer}</pre> : null}
    </div>
  );
}
