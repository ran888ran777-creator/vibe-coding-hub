import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getCurrentMessages } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const { t } = await getCurrentMessages();

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
        <p className="eyebrow">{t.settings.environment}</p>
        <h2>{t.settings.configuredProviders}</h2>
        <table>
          <tbody>
            <tr>
              <th>{t.settings.database}</th>
              <td>{configured.database ? t.settings.connected : t.settings.missingDatabase}</td>
            </tr>
            <tr>
              <th>{t.settings.firecrawl}</th>
              <td>{configured.firecrawl ? t.settings.configured : t.settings.missingFirecrawl}</td>
            </tr>
            <tr>
              <th>{t.settings.openai}</th>
              <td>{configured.openai ? t.settings.configured : t.settings.missingOpenai}</td>
            </tr>
            <tr>
              <th>{t.settings.storage}</th>
              <td>{configured.storage ? t.settings.configured : t.settings.missingStorage}</td>
            </tr>
          </tbody>
        </table>
      </article>
      <article>
        <p className="eyebrow">{t.settings.account}</p>
        <h2>
          {t.settings.signedInAs} {user.email}
        </h2>
        <p>{t.settings.accountBody}</p>
      </article>
      <article>
        <p className="eyebrow">{t.settings.nextStep}</p>
        <h2>{t.settings.jobsTitle}</h2>
        <p>{t.settings.jobsBody}</p>
      </article>
    </main>
  );
}
