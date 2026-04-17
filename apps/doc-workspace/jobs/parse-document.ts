import { db } from "@/lib/db";
import { parseDocumentFromUrl } from "@/lib/firecrawl";
import { cleanParsedMarkdown } from "@/lib/ocr";

function toJsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value)) as any;
}

export async function runParseDocument(documentId: string) {
  const document = await db.document.findUnique({ where: { id: documentId } });

  if (!document?.externalUrl) {
    throw new Error("A document URL is required before parsing.");
  }

  await db.document.update({
    where: { id: documentId },
    data: {
      status: "PARSING",
      lastError: null
    }
  });

  try {
    const parsed = await parseDocumentFromUrl(
      document.externalUrl,
      document.mimeType ?? undefined,
      document.pdfParseMode
    );
    const cleanedMarkdown = cleanParsedMarkdown(parsed.markdown);

    await db.documentParse.upsert({
      where: { documentId },
      update: {
        rawJson: toJsonValue(parsed.raw),
        markdown: parsed.markdown,
        cleanedMarkdown,
        metadataJson: toJsonValue(parsed.metadata),
        tablesJson: toJsonValue(parsed.tables),
        parsedAt: new Date()
      },
      create: {
        documentId,
        rawJson: toJsonValue(parsed.raw),
        markdown: parsed.markdown,
        cleanedMarkdown,
        metadataJson: toJsonValue(parsed.metadata),
        tablesJson: toJsonValue(parsed.tables),
        parsedAt: new Date()
      }
    });

    await db.documentSummary.deleteMany({
      where: { documentId }
    });

    await db.documentQAMessage.deleteMany({
      where: { documentId }
    });

    await db.document.update({
      where: { id: documentId },
      data: { status: "PARSED" }
    });
  } catch (error) {
    await db.document.update({
      where: { id: documentId },
      data: {
        status: "FAILED",
        lastError: error instanceof Error ? error.message : "Unknown parse error"
      }
    });
    throw error;
  }
}
