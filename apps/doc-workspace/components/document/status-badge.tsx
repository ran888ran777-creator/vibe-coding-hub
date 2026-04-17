type DocumentStatusValue = "UPLOADED" | "PARSING" | "PARSED" | "SUMMARIZING" | "READY" | "FAILED";

const labelMap: Record<DocumentStatusValue, string> = {
  UPLOADED: "Queued",
  PARSING: "Parsing",
  PARSED: "Parsed",
  SUMMARIZING: "Summarizing",
  READY: "Ready",
  FAILED: "Failed"
};

export function StatusBadge({ status }: { status: DocumentStatusValue }) {
  return <span className={`status status-${status.toLowerCase()}`}>{labelMap[status]}</span>;
}
