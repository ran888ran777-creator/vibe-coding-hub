"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
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
      <p className="eyebrow">{mode === "login" ? "Welcome back" : "Create account"}</p>
      <h1>{mode === "login" ? "Sign in" : "Register"}</h1>
      <p className="muted-note">
        {mode === "login"
          ? "Use your workspace credentials to continue."
          : "Create a local account for this Doc Workspace instance."}
      </p>

      {mode === "register" ? (
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Founding operator"
            required
          />
        </label>
      ) : null}

      <label className="field">
        <span>Email</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          placeholder="Minimum 8 characters"
          required
          type="password"
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={submitting} type="submit">
        {submitting ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="muted-note">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/auth/register" : "/auth/login"}>
          {mode === "login" ? "Register" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
