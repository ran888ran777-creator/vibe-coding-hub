import { NextResponse } from "next/server";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth";
import { createSignedUploadUrl } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    await requireCurrentUser();
    const body = (await request.json()) as { fileName?: string; contentType?: string };

    if (!body.fileName || !body.contentType) {
      return NextResponse.json({ error: "fileName and contentType are required." }, { status: 400 });
    }

    return NextResponse.json(await createSignedUploadUrl(body.fileName, body.contentType));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to sign upload." },
      { status: 500 }
    );
  }
}
