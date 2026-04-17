import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { answerQuestion } from "@/lib/openai";
import { askQuestionSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = askQuestionSchema.parse(await request.json());
    const document = await db.document.findUnique({
      where: { id },
      include: { parse: true }
    });

    if (!document?.parse?.markdown) {
      return NextResponse.json({ error: "Document must be parsed before Q&A." }, { status: 400 });
    }

    const answer = await answerQuestion(document.parse.markdown, body.question);

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Question failed." },
      { status: 500 }
    );
  }
}
