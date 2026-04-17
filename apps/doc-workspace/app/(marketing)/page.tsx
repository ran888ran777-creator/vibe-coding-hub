import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentMessages } from "@/lib/i18n-server";

export default async function MarketingPage() {
  const user = await getCurrentUser();
  const { t } = await getCurrentMessages();

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Firecrawl x AI Workflow</p>
          <h1>{t.appName}</h1>
          <p>{t.appTagline}</p>
          <div className="cta-row">
            {user ? (
              <>
                <Link className="primary-button" href="/documents/new">
                  {t.nav.newDocument}
                </Link>
                <Link className="ghost-button" href="/dashboard">
                  {t.nav.dashboard}
                </Link>
              </>
            ) : (
              <>
                <Link className="primary-button" href="/auth/register">
                  {t.nav.register}
                </Link>
                <Link className="ghost-button" href="/auth/login">
                  {t.nav.signIn}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-side">
          <div className="panel">
            <p className="eyebrow">Core loop</p>
            <h2>Upload - Parse - Summarize - Export</h2>
            <p>Built for finance packs, tenders, policies, contracts, and internal operations docs.</p>
          </div>
          <div className="panel">
            <p className="eyebrow">Production-minded MVP</p>
            <p>Next.js, Prisma, DB-backed jobs, R2-compatible storage, Firecrawl parsing, and OpenAI review.</p>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <article>
          <h2>Document parsing</h2>
          <p>Keep raw Firecrawl responses and parsed markdown for auditability and retries.</p>
        </article>
        <article>
          <h2>AI review layer</h2>
          <p>Run summaries, key facts, and later Q&A only after a stable parse is stored.</p>
        </article>
        <article>
          <h2>Operational clarity</h2>
          <p>Every document has a source, status, queued jobs, export history, and failure reason.</p>
        </article>
      </section>
    </main>
  );
}
