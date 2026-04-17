import Link from "next/link";

export default function MarketingPage() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Firecrawl x AI Workflow</p>
          <h1>Parse documents into a workspace, not a dead blob.</h1>
          <p>
            Upload contracts, reports, policies, and spreadsheets. Parse them with Firecrawl, review the markdown,
            extract key facts, and export clean artifacts for downstream work.
          </p>
          <div className="cta-row">
            <Link className="primary-button" href="/documents/new">
              Create first document
            </Link>
            <Link className="ghost-button" href="/dashboard">
              Open dashboard
            </Link>
          </div>
        </div>
        <div className="hero-side">
          <div className="panel">
            <p className="eyebrow">Core loop</p>
            <h2>Upload → Parse → Summarize → Export</h2>
            <p>Built for finance packs, tenders, policies, contracts, and internal operations docs.</p>
          </div>
          <div className="panel">
            <p className="eyebrow">Production-minded MVP</p>
            <p>Next.js, Prisma, R2-compatible storage, Firecrawl parsing, and OpenAI review layered on top.</p>
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
          <p>Every document has a source, status, export history, and failure reason instead of hidden magic.</p>
        </article>
      </section>
    </main>
  );
}
