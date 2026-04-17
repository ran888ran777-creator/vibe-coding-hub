const cyrillicLatinMap: Record<string, string> = {
  A: "А",
  B: "В",
  C: "С",
  E: "Е",
  H: "Н",
  K: "К",
  M: "М",
  O: "О",
  P: "Р",
  T: "Т",
  X: "Х",
  Y: "У",
  a: "а",
  c: "с",
  e: "е",
  o: "о",
  p: "р",
  x: "х",
  y: "у"
};

function fixMixedScriptToken(token: string) {
  const hasCyrillic = /[А-Яа-яЁё]/.test(token);
  const hasLatin = /[A-Za-z]/.test(token);

  if (!hasCyrillic || !hasLatin) {
    return token;
  }

  return token
    .split("")
    .map((char) => cyrillicLatinMap[char] ?? char)
    .join("");
}

function isNoiseLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  const letters = (trimmed.match(/[A-Za-zА-Яа-яЁё]/g) ?? []).length;
  const symbols = (trimmed.match(/[^A-Za-zА-Яа-яЁё0-9\s]/g) ?? []).length;
  const ratio = symbols / Math.max(trimmed.length, 1);

  return letters < 3 && ratio > 0.35;
}

export function cleanParsedMarkdown(markdown: string) {
  const normalized = markdown
    .replace(/\\-/g, "-")
    .replace(/\\_/g, "_")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ");

  const cleanedLines = normalized
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(/(\s+)/)
        .map((part) => (/\s+/.test(part) ? part : fixMixedScriptToken(part)))
        .join("")
        .replace(/\s+([.,;:!?])/g, "$1")
        .replace(/([(\[{])\s+/g, "$1")
        .replace(/\s+([)\]}])/g, "$1")
        .replace(/\s{2,}/g, " ")
        .trimEnd()
    )
    .filter((line, index, source) => {
      if (isNoiseLine(line)) {
        return false;
      }

      if (!line.trim() && !source[index - 1]?.trim()) {
        return false;
      }

      return true;
    });

  return cleanedLines
    .join("\n")
    .replace(/Puc\b/g, "Рис")
    .replace(/\bmontаж/gi, "монтаж")
    .replace(/\bendова/gi, "ендова")
    .replace(/\bprofil/gi, "профиль")
    .replace(/\bжелoba/gi, "желоба")
    .replace(/\btrуб/gi, "труб")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
