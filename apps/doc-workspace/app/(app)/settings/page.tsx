import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const configured = {
    firecrawl: Boolean(env.FIRECRAWL_API_KEY),
    openai: Boolean(env.OPENAI_API_KEY),
    storage: Boolean(env.R2_BUCKET && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY),
    database: Boolean(env.DATABASE_URL)
  };

  return (
    <main className="section-grid">
      <article>
        <p className="eyebrow">Environment</p>
        <h2>Configured providers</h2>
        <table>
          <tbody>
            <tr>
              <th>Database</th>
              <td>{configured.database ? "Connected" : "Missing DATABASE_URL"}</td>
            </tr>
            <tr>
              <th>Firecrawl</th>
              <td>{configured.firecrawl ? "Configured" : "Missing FIRECRAWL_API_KEY"}</td>
            </tr>
            <tr>
              <th>OpenAI</th>
              <td>{configured.openai ? "Configured" : "Missing OPENAI_API_KEY"}</td>
            </tr>
            <tr>
              <th>Storage</th>
              <td>{configured.storage ? "Configured" : "Missing R2_* env vars"}</td>
            </tr>
          </tbody>
        </table>
      </article>
      <article>
        <p className="eyebrow">Account</p>
        <h2>Signed in as {user.email}</h2>
        <p>
          Local auth is now cookie-backed with password hashing. For production, replace it only if you need SSO,
          password reset, or organization-level controls.
        </p>
      </article>
      <article>
        <p className="eyebrow">Next step</p>
        <h2>Background processing is DB-backed</h2>
        <p>
          Parse and summary now enqueue jobs and return immediately. The current runner is in-process for local MVP
          usage; replace it with Inngest or Trigger.dev if you need multi-instance reliability and retries.
        </p>
      </article>
    </main>
  );
}
