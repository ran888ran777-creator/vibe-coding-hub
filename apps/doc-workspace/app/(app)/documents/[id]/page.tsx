import { notFound } from "next/navigation";
import { db } from "@/lib/db";
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
  const document = await db.document.findUnique({
    where: { id },
    include: {
      parse: true,
      summaries: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!document) {
    notFound();
  }

  const latestSummary = document.summaries[0]?.content;
  const tables = Array.isArray(document.parse?.tablesJson) ? document.parse.tablesJson : [];

  return (
    <main>
      <div className="cta-row">
        <div>
          <p className="eyebrow">Document workspace</p>
          <h1>{document.title}</h1>
          <div className="meta-row">
            <StatusBadge status={document.status} />
            <span className="meta">{document.sourceType}</span>
          </div>
        </div>
      </div>

      <div className="workspace-grid">
        <section className="panel">
          <h3>Markdown</h3>
          {document.parse?.markdown ? (
            <pre className="markdown-shell">{document.parse.markdown}</pre>
          ) : (
            <div className="empty-state">No parsed markdown yet. Run parse first.</div>
          )}
        </section>

        <section className="summary-grid">
          <DocumentActions documentId={document.id} />
          <div className="panel">
            <p className="eyebrow">Overview</p>
            {latestSummary ? <pre className="answer-box">{latestSummary}</pre> : <p className="muted-note">No summary yet.</p>}
          </div>
          <div className="panel">
            <p className="eyebrow">Metadata</p>
            <pre className="answer-box">{JSON.stringify(document.parse?.metadataJson ?? {}, null, 2)}</pre>
          </div>
          <div className="panel">
            <p className="eyebrow">Tables</p>
            {tables.length > 0 ? (
              <pre className="answer-box">{JSON.stringify(tables, null, 2)}</pre>
            ) : (
              <p className="muted-note">No extracted tables available.</p>
            )}
          </div>
        </section>
      </div>

      <AskForm documentId={document.id} />
    </main>
  );
}
