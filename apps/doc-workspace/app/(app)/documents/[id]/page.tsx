import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentLocale, getCurrentMessages } from "@/lib/i18n-server";
import { StatusBadge } from "@/components/document/status-badge";
import { DocumentActions } from "@/components/document/document-actions";
import { AskForm } from "@/components/document/ask-form";

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const locale = await getCurrentLocale();
  const { t } = await getCurrentMessages();

  if (!user) {
    redirect("/auth/login");
  }

  const document = await db.document.findFirst({
    where: {
      id,
      userId: user.id
    },
    include: {
      parse: true,
      summaries: {
        orderBy: { createdAt: "desc" }
      },
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 6
      }
    }
  });

  if (!document) {
    notFound();
  }

  const latestSummary = document.summaries[0]?.content;
  const tables = Array.isArray(document.parse?.tablesJson) ? document.parse.tablesJson : [];
  const cleanedMarkdown = document.parse?.cleanedMarkdown ?? document.parse?.markdown ?? "";
  const rawMarkdown = document.parse?.markdown ?? "";

  return (
    <main>
      <div className="cta-row">
        <div>
          <p className="eyebrow">{t.document.workspace}</p>
          <h1>{document.title}</h1>
          <div className="meta-row">
            <StatusBadge locale={locale} status={document.status} />
            <span className="meta">{document.sourceType}</span>
            <span className="meta">
              {t.document.parseMode}: {document.pdfParseMode}
            </span>
          </div>
        </div>
      </div>

      <div className="workspace-grid workspace-grid-document">
        <div className="content-stack">
          <section className="panel">
            <div className="panel-head">
              <h3>{t.document.cleaned}</h3>
              <span className="meta">{t.document.cleanedNote}</span>
            </div>
            {cleanedMarkdown ? (
              <pre className="markdown-shell cleaned-shell">{cleanedMarkdown}</pre>
            ) : (
              <div className="empty-state">{t.document.noParse}</div>
            )}
          </section>

          <section className="panel panel-raw">
            <div className="panel-head">
              <h3>{t.document.raw}</h3>
            </div>
            {rawMarkdown ? (
              <pre className="markdown-shell raw-shell">{rawMarkdown}</pre>
            ) : (
              <div className="empty-state">{t.document.noParse}</div>
            )}
          </section>
        </div>

        <section className="summary-grid">
          <DocumentActions documentId={document.id} locale={locale} status={document.status} />
          <div className="panel">
            <p className="eyebrow">{t.document.overview}</p>
            {latestSummary ? <pre className="answer-box">{latestSummary}</pre> : <p className="muted-note">{t.document.noSummary}</p>}
          </div>
          <div className="panel">
            <p className="eyebrow">{t.document.metadata}</p>
            <pre className="answer-box">{JSON.stringify(document.parse?.metadataJson ?? {}, null, 2)}</pre>
          </div>
          <div className="panel">
            <p className="eyebrow">{t.document.tables}</p>
            {tables.length > 0 ? (
              <pre className="answer-box">{JSON.stringify(tables, null, 2)}</pre>
            ) : (
              <p className="muted-note">{t.document.noTables}</p>
            )}
          </div>
          <div className="panel">
            <p className="eyebrow">{t.document.jobs}</p>
            {document.jobs.length > 0 ? (
              <div className="job-list">
                {document.jobs.map((job) => (
                  <div className="job-row" key={job.id}>
                    <strong>{t.jobs[job.type]}</strong>
                    <span className={`meta job-status job-${job.status.toLowerCase()}`}>{t.jobs[job.status]}</span>
                    {job.lastError ? <span className="error-text">{job.lastError}</span> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted-note">{t.document.noJobs}</p>
            )}
          </div>
        </section>
      </div>

      <AskForm documentId={document.id} disabled={document.status !== "READY"} locale={locale} />
    </main>
  );
}
