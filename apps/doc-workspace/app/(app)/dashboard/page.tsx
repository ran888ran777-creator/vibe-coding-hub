import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentLocale, getCurrentMessages } from "@/lib/i18n-server";
import { StatusBadge } from "@/components/document/status-badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const locale = await getCurrentLocale();
  const { t } = await getCurrentMessages();

  if (!user) {
    redirect("/auth/login");
  }

  const documents = await db.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main>
      <div className="cta-row">
        <div>
          <p className="eyebrow">{t.dashboard.title}</p>
          <h1>{user.name ? `${user.name}'s documents` : t.dashboard.yourDocuments}</h1>
        </div>
        <Link className="primary-button" href="/documents/new">
          {t.nav.newDocument}
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">{t.dashboard.empty}</div>
      ) : (
        <div className="dashboard-list">
          {documents.map((document: (typeof documents)[number]) => (
            <article key={document.id}>
              <div>
                <h2>
                  <Link href={`/documents/${document.id}`}>{document.title}</Link>
                </h2>
                <div className="meta-row">
                  <span className="meta">{document.sourceType}</span>
                  <span className="meta">{document.originalName ?? document.externalUrl ?? t.dashboard.untitled}</span>
                </div>
              </div>
              <StatusBadge locale={locale} status={document.status} />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
