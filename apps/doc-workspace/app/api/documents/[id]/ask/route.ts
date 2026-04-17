import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth";
import { answerQuestion } from "@/lib/openai";
import { askQuestionSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = askQuestionSchema.parse(await request.json());
    const document = await db.document.findFirst({
      where: {
        id,
        userId: user.id
      },
      include: { parse: true }
    });

    const sourceMarkdown = document?.parse?.cleanedMarkdown ?? document?.parse?.markdown;

    if (!sourceMarkdown) {
      return NextResponse.json({ error: "Document must be parsed before Q&A." }, { status: 400 });
    }

    const answer = await answerQuestion(sourceMarkdown, body.question);

    await db.documentQAMessage.createMany({
      data: [
        {
          documentId: id,
          role: "USER",
          content: body.question
        },
        {
          documentId: id,
          role: "ASSISTANT",
          content: answer
        }
      ]
    });

    return NextResponse.json({ answer });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Question failed." },
      { status: 500 }
    );
  }
}
