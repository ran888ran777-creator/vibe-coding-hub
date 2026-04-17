export function buildMarkdownExport(input: { title: string; markdown: string; summary?: string }) {
  return `# ${input.title}\n\n${input.summary ? `## Summary\n\n${input.summary}\n\n` : ""}## Parsed Markdown\n\n${input.markdown}`;
}

export function buildJsonExport(input: {
  title: string;
  markdown: string;
  metadata: unknown;
  tables: unknown;
  summary?: string;
}) {
  return JSON.stringify(
    {
      title: input.title,
      summary: input.summary ?? null,
      markdown: input.markdown,
      metadata: input.metadata,
      tables: input.tables
    },
    null,
    2
  );
}
