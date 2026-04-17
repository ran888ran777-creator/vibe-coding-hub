import { NextResponse } from "next/server";
import { runSummarizeDocument } from "@/jobs/summarize-document";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await runSummarizeDocument(id);
    return NextResponse.json({ message: "Summary generated." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Summary failed." },
      { status: 500 }
    );
  }
}
