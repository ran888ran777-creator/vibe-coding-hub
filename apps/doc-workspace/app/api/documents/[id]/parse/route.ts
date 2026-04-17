import { NextResponse } from "next/server";
import { runParseDocument } from "@/jobs/parse-document";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await runParseDocument(id);
    return NextResponse.json({ message: "Parse completed." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Parse failed." },
      { status: 500 }
    );
  }
}
