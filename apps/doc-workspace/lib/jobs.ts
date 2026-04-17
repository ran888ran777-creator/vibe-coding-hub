import { db } from "@/lib/db";
import { runParseDocument } from "@/jobs/parse-document";
import { runSummarizeDocument } from "@/jobs/summarize-document";

declare global {
  var __docWorkspaceRunnerPromise: Promise<void> | undefined;
}

async function processJob(jobId: string) {
  const job = await db.documentJob.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    return;
  }

  await db.documentJob.update({
    where: { id: jobId },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
      attempts: {
        increment: 1
      },
      lastError: null
    }
  });

  try {
    if (job.type === "PARSE") {
      await runParseDocument(job.documentId);
    } else {
      await runSummarizeDocument(job.documentId);
    }

    await db.documentJob.update({
      where: { id: jobId },
      data: {
        status: "SUCCEEDED",
        finishedAt: new Date()
      }
    });
  } catch (error) {
    await db.documentJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        lastError: error instanceof Error ? error.message : "Unknown job error"
      }
    });
  }
}

async function runQueueLoop() {
  while (true) {
    const nextJob = await db.documentJob.findFirst({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" }
    });

    if (!nextJob) {
      break;
    }

    await processJob(nextJob.id);
  }
}

export async function enqueueDocumentJob(documentId: string, type: "PARSE" | "SUMMARY") {
  const existing = await db.documentJob.findFirst({
    where: {
      documentId,
      type,
      status: {
        in: ["PENDING", "RUNNING"]
      }
    },
    orderBy: { createdAt: "desc" }
  });

  if (existing) {
    kickJobRunner();
    return existing;
  }

  const job = await db.documentJob.create({
    data: {
      documentId,
      type
    }
  });

  kickJobRunner();
  return job;
}

export function kickJobRunner() {
  if (!globalThis.__docWorkspaceRunnerPromise) {
    globalThis.__docWorkspaceRunnerPromise = runQueueLoop().finally(() => {
      globalThis.__docWorkspaceRunnerPromise = undefined;
    });
  }

  return globalThis.__docWorkspaceRunnerPromise;
}
