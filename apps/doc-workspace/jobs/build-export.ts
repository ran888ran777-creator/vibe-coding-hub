import { db } from "@/lib/db";
import { buildJsonExport, buildMarkdownExport } from "@/lib/export";

export async function runBuildExport(documentId: string, format: "MARKDOWN" | "JSON") {
  const document = await db.document.findUnique({
    where: { id: documentId },
    include: {
      parse: true,
      summaries: true
    }
  });

  if (!document?.parse) {
    throw new Error("Document parse is missing.");
  }

  const summary = document.summaries.at(-1)?.content;
  const payload =
    format === "MARKDOWN"
      ? buildMarkdownExport({
          title: document.title,
          markdown: document.parse.markdown ?? "",
          summary
        })
      : buildJsonExport({
          title: document.title,
          markdown: document.parse.markdown ?? "",
          metadata: document.parse.metadataJson ?? {},
          tables: document.parse.tablesJson ?? [],
          summary
        });

  const storageKey = `exports/${documentId}.${format === "MARKDOWN" ? "md" : "json"}`;

  await db.documentExport.create({
    data: {
      documentId,
      format,
      storageKey
    }
  });

  return {
    storageKey,
    payload
  };
}
