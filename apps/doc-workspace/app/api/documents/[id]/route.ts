import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth";

export async function GET(
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
      include: {
        parse: true,
        summaries: true,
        exports: true,
        qaMessages: true,
        jobs: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load document." },
      { status: 500 }
    );
  }
}
