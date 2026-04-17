import { NextResponse } from "next/server";
import { runBuildExport } from "@/jobs/build-export";
import { db } from "@/lib/db";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth";

export async function POST(
  request: Request,
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

    const body = (await request.json()) as { format?: "MARKDOWN" | "JSON" };
    const format = body.format ?? "MARKDOWN";
    const built = await runBuildExport(id, format);

    return NextResponse.json({
      message: "Export built.",
      payload: built.payload,
      download: built.storageKey.split("/").at(-1)
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed." },
      { status: 500 }
    );
  }
}
