import { env } from "@/lib/env";

type FirecrawlResponse = {
  data?: {
    markdown?: string;
    metadata?: Record<string, unknown>;
    tables?: unknown[];
  };
  markdown?: string;
  metadata?: Record<string, unknown>;
  error?: string;
};

export async function parseDocumentFromUrl(url: string, mimeType?: string) {
  if (!env.FIRECRAWL_API_KEY) {
    if (env.DEV_USE_MOCK_SERVICES) {
      return {
        raw: {
          source: "mock-firecrawl",
          url,
          mimeType
        },
        markdown: `# Mock parse\n\nSource: ${url}\n\nThis document was parsed in local mock mode.\n\n## Key sections\n\n- Input URL or uploaded file was accepted\n- Firecrawl API key is not configured\n- Replace mock mode with a real key to get production parsing\n`,
        metadata: {
          source: "mock-firecrawl",
          mimeType: mimeType ?? "unknown",
          url
        },
        tables: [
          [
            { column: "field", value: "status" },
            { column: "value", value: "mocked" }
          ]
        ]
      };
    }

    throw new Error("FIRECRAWL_API_KEY is missing.");
  }

  const parsers = mimeType?.includes("pdf") ? [{ type: "pdf", mode: "auto" }] : undefined;

  const response = await fetch(`${env.FIRECRAWL_BASE_URL}/v1/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "html"],
      parsers
    })
  });

  if (!response.ok) {
    throw new Error(`Firecrawl request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as FirecrawlResponse;
  if (payload.error) {
    throw new Error(payload.error);
  }

  return {
    raw: payload,
    markdown: payload.data?.markdown ?? payload.markdown ?? "",
    metadata: payload.data?.metadata ?? payload.metadata ?? {},
    tables: payload.data?.tables ?? []
  };
}
