import OpenAI from "openai";
import { env } from "@/lib/env";

function getClient() {
  if (!env.OPENAI_API_KEY) {
    if (env.DEV_USE_MOCK_SERVICES) {
      return null;
    }

    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export async function generateSummary(markdown: string) {
  const client = getClient();
  if (!client) {
    const preview = markdown.slice(0, 800);
    return `Overview:\nLocal mock summary generated because OPENAI_API_KEY is not configured.\n\nKey facts:\n- Parsed markdown is available\n- Document preview length: ${preview.length} chars\n- Replace mock mode with a real key for semantic summaries\n\nAction items:\n- Connect Firecrawl and OpenAI keys\n- Tune extraction prompts\n- Add background jobs`;
  }

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
  if (!client) {
    return `Mock answer:\nQuestion: ${question}\n\nThe app is running in local mock mode. Parsed markdown length: ${markdown.length} characters. Add OPENAI_API_KEY for evidence-based answers from the model.`;
  }

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
