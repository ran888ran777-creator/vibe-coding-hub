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

async function requestScrape(url: string, parsers?: Array<Record<string, unknown>>) {
  const response = await fetch(`${env.FIRECRAWL_BASE_URL}/v2/scrape`, {
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

  const rawText = await response.text();
  let payload = {} as FirecrawlResponse;
  if (rawText) {
    try {
      payload = JSON.parse(rawText) as FirecrawlResponse;
    } catch {
      payload = {
        error: rawText
      };
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    payload
  };
}

export async function parseDocumentFromUrl(
  url: string,
  mimeType?: string,
  pdfParseMode: "AUTO" | "OCR" | "FAST" = "AUTO"
) {
  if (!env.FIRECRAWL_API_KEY) {
    if (env.DEV_USE_MOCK_SERVICES) {
      return {
        raw: {
          source: "mock-firecrawl",
          url,
          mimeType,
          pdfParseMode
        },
        markdown: `# Mock parse\n\nSource: ${url}\n\nThis document was parsed in local mock mode.\n\n## Key sections\n\n- Input URL or uploaded file was accepted\n- Firecrawl API key is not configured\n- Replace mock mode with a real key to get production parsing\n`,
        metadata: {
          source: "mock-firecrawl",
          mimeType: mimeType ?? "unknown",
          url,
          pdfParseMode
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

  const shouldUsePdfParser = mimeType?.includes("pdf") || url.toLowerCase().includes(".pdf");
  const parserMode = pdfParseMode.toLowerCase();
  const parsers = shouldUsePdfParser ? [{ type: "pdf", mode: parserMode }] : undefined;
  let result = await requestScrape(url, parsers);

  if (!result.ok && shouldUsePdfParser && pdfParseMode !== "AUTO") {
    result = await requestScrape(url, [{ type: "pdf" }]);
  }

  if (!result.ok) {
    throw new Error(`Firecrawl request failed with ${result.status}${result.payload.error ? `: ${result.payload.error}` : "."}`);
  }

  const payload = result.payload;
  if (payload.error) {
    throw new Error(payload.error);
  }

  return {
    raw: payload,
    markdown: payload.data?.markdown ?? payload.markdown ?? "",
    metadata: {
      ...(payload.data?.metadata ?? payload.metadata ?? {}),
      pdfParseMode: shouldUsePdfParser ? pdfParseMode : null
    },
    tables: payload.data?.tables ?? []
  };
}
