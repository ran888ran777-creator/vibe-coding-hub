"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMessages, type Locale } from "@/lib/i18n";

export function AuthForm({ mode, locale }: { mode: "login" | "register"; locale: Locale }) {
  const router = useRouter();
  const t = getMessages(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Authentication failed.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unknown authentication error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel form-panel auth-panel" onSubmit={handleSubmit}>
      <p className="eyebrow">{mode === "login" ? t.auth.welcomeBack : t.auth.createAccount}</p>
      <h1>{mode === "login" ? t.auth.signIn : t.auth.register}</h1>
      <p className="muted-note">{mode === "login" ? t.auth.useCredentials : t.auth.createLocalAccount}</p>

      {mode === "register" ? (
        <label className="field">
          <span>{t.auth.name}</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder={t.auth.namePlaceholder} required />
        </label>
      ) : null}

      <label className="field">
        <span>{t.auth.email}</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t.auth.emailPlaceholder}
          required
          type="email"
        />
      </label>

      <label className="field">
        <span>{t.auth.password}</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          placeholder={t.auth.passwordPlaceholder}
          required
          type="password"
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={submitting} type="submit">
        {submitting ? t.auth.working : mode === "login" ? t.auth.signIn : t.auth.createAccount}
      </button>

      <p className="muted-note">
        {mode === "login" ? t.auth.needAccount : t.auth.haveAccount}{" "}
        <Link href={mode === "login" ? "/auth/register" : "/auth/login"}>
          {mode === "login" ? t.auth.register : t.auth.signIn}
        </Link>
      </p>
    </form>
  );
}
