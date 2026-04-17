import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth";
import { uploadFileToStorage } from "@/lib/storage";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const documents = await db.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to fetch documents." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const formData = await request.formData();
    const title = String(formData.get("title") ?? "");
    const sourceType = String(formData.get("sourceType") ?? "URL");
    const pdfParseMode = String(formData.get("pdfParseMode") ?? "AUTO");

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    let externalUrl: string | null = null;
    let storageKey: string | null = null;
    let originalName: string | null = null;
    let mimeType: string | null = null;

    if (sourceType === "FILE") {
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "File upload is required." }, { status: 400 });
      }

      const uploaded = await uploadFileToStorage(file);
      externalUrl = uploaded.publicUrl;
      storageKey = uploaded.key;
      originalName = file.name;
      mimeType = file.type;
    } else {
      externalUrl = String(formData.get("externalUrl") ?? "");
      if (!externalUrl) {
        return NextResponse.json({ error: "External URL is required." }, { status: 400 });
      }
    }

    const document = await db.document.create({
      data: {
        userId: user.id,
        title,
        status: "UPLOADED",
        sourceType: sourceType === "FILE" ? "FILE" : "URL",
        pdfParseMode: pdfParseMode === "OCR" ? "OCR" : pdfParseMode === "FAST" ? "FAST" : "AUTO",
        externalUrl,
        storageKey,
        originalName,
        mimeType
      }
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create document." },
      { status: 500 }
    );
  }
}
