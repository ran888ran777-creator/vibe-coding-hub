import { redirect } from "next/navigation";
import { DocumentForm } from "@/components/document/document-form";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentLocale, getCurrentMessages } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function NewDocumentPage() {
  const user = await getCurrentUser();
  const locale = await getCurrentLocale();
  const { t } = await getCurrentMessages();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="workspace-grid">
      <section className="panel">
        <p className="eyebrow">{t.newDocument.eyebrow}</p>
        <h1>{t.newDocument.title}</h1>
        <p>{t.newDocument.body}</p>
      </section>
      <DocumentForm locale={locale} />
    </main>
  );
}
