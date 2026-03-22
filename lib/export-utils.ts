export function fieldsToCSV(fields: Record<string, string>): string {
  const rows = Object.entries(fields).map(
    ([key, value]) => `"${key.replace(/"/g, '""')}","${String(value).replace(/"/g, '""')}"`
  );
  return ["Field,Value", ...rows].join("\n");
}

export function tableToCSV(table: string[][]): string {
  return table
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function exportCSV(fields: Record<string, string>, table?: string[][]): string {
  const parts: string[] = [];
  if (Object.keys(fields).length > 0) {
    parts.push(fieldsToCSV(fields));
  }
  if (table && table.length > 0) {
    if (parts.length > 0) parts.push(""); // blank line separator
    parts.push(tableToCSV(table));
  }
  return parts.join("\n");
}

export function exportJSON(fields: Record<string, string>, table?: string[][]): string {
  return JSON.stringify({ fields, ...(table ? { table } : {}) }, null, 2);
}

export function exportClipboard(fields: Record<string, string>, table?: string[][]): string {
  const parts: string[] = [];
  if (Object.keys(fields).length > 0) {
    parts.push(
      Object.entries(fields)
        .map(([k, v]) => `${k}\t${v}`)
        .join("\n")
    );
  }
  if (table && table.length > 0) {
    if (parts.length > 0) parts.push("");
    parts.push(table.map((row) => row.join("\t")).join("\n"));
  }
  return parts.join("\n");
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
