import OpenAI from "openai";
import { env } from "@/lib/env";

function getClient() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export async function generateSummary(markdown: string) {
  const client = getClient();
  const completion = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: "You summarize parsed business documents with precision."
      },
      {
        role: "user",
        content: `Summarize this document. Return overview, key facts, and action items.\n\n${markdown}`
      }
    ]
  });

  return completion.output_text;
}

export async function answerQuestion(markdown: string, question: string) {
  const client = getClient();
  const completion = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: "Answer only from the provided document text. If evidence is missing, say so directly."
      },
      {
        role: "user",
        content: `Document:\n${markdown}\n\nQuestion:\n${question}`
      }
    ]
  });

  return completion.output_text;
}
