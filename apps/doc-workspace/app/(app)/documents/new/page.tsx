import { redirect } from "next/navigation";
import { DocumentForm } from "@/components/document/document-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewDocumentPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="workspace-grid">
      <section className="panel">
        <p className="eyebrow">New document</p>
        <h1>Create a parsing workspace</h1>
        <p>
          Start narrow: upload a file to storage or paste a URL to a supported document. Firecrawl parses it, then the
          workspace layers summary, facts, and export on top.
        </p>
      </section>
      <DocumentForm />
    </main>
  );
}
