import { NextResponse } from "next/server";
import { runBuildExport } from "@/jobs/build-export";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { format?: "MARKDOWN" | "JSON" };
    const format = body.format ?? "MARKDOWN";
    const built = await runBuildExport(id, format);

    return NextResponse.json({
      message: "Export built.",
      payload: built.payload,
      download: built.storageKey.split("/").at(-1)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed." },
      { status: 500 }
    );
  }
}
