import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth";
import { enqueueDocumentJob } from "@/lib/jobs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const document = await db.document.findFirst({
      where: {
        id,
        userId: user.id
      },
      select: { id: true }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const job = await enqueueDocumentJob(id, "PARSE");
    return NextResponse.json({ message: "Parse job queued.", jobId: job.id }, { status: 202 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Parse failed." },
      { status: 500 }
    );
  }
}
