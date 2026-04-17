import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
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
        <p className="eyebrow">Production note</p>
        <h2>Replace dev auth before launch</h2>
        <p>
          The scaffold uses a single development user so the MVP can move immediately. Before production, swap this for
          Clerk or Supabase Auth and scope every document query by the authenticated user.
        </p>
      </article>
      <article>
        <p className="eyebrow">Next step</p>
        <h2>Move parse and summary into jobs</h2>
        <p>
          The route handlers call jobs directly right now. In production, route them through Inngest or Trigger.dev to
          get retries, observability, and no long-running browser waits.
        </p>
      </article>
    </main>
  );
}
