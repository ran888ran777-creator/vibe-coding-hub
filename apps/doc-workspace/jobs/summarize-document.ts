import { db } from "@/lib/db";
import { generateSummary } from "@/lib/openai";

export async function runSummarizeDocument(documentId: string) {
  const document = await db.document.findUnique({
    where: { id: documentId },
    include: { parse: true }
  });

  const sourceMarkdown = document?.parse?.cleanedMarkdown ?? document?.parse?.markdown;

  if (!sourceMarkdown) {
    throw new Error("Parsed markdown is required before summarizing.");
  }

  await db.document.update({
    where: { id: documentId },
    data: {
      status: "SUMMARIZING",
      lastError: null
    }
  });

  try {
    const summary = await generateSummary(sourceMarkdown);

    await db.documentSummary.create({
      data: {
        documentId,
        kind: "OVERVIEW",
        content: summary
      }
    });

    await db.document.update({
      where: { id: documentId },
      data: { status: "READY" }
    });
  } catch (error) {
    await db.document.update({
      where: { id: documentId },
      data: {
        status: "FAILED",
        lastError: error instanceof Error ? error.message : "Unknown summary error"
      }
    });
    throw error;
  }
}
