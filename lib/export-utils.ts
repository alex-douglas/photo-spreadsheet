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

export interface ExportPageSlice {
  fields: Record<string, string>;
  table?: string[][];
}

/** One CSV/JSON/clipboard payload for all PDF pages (or any ordered slices). */
export function exportCSVFromPageSlices(slices: ExportPageSlice[]): string {
  if (slices.length === 0) return "";
  if (slices.length === 1) return exportCSV(slices[0]!.fields, slices[0]!.table);
  return slices
    .map((slice, i) => {
      const labelRow = `"Section","Page ${i + 1}"`;
      return [labelRow, "", exportCSV(slice.fields, slice.table)].join("\n");
    })
    .join("\n\n");
}

export function exportJSONFromPageSlices(slices: ExportPageSlice[]): string {
  return JSON.stringify(
    slices.length > 1
      ? {
          pages: slices.map((slice, i) => ({
            page: i + 1,
            fields: slice.fields,
            ...(slice.table?.length ? { table: slice.table } : {}),
          })),
        }
      : { fields: slices[0]?.fields ?? {}, ...(slices[0]?.table ? { table: slices[0].table } : {}) },
    null,
    2
  );
}

export function exportClipboardFromPageSlices(slices: ExportPageSlice[]): string {
  return slices
    .map((slice, i) => {
      const label = slices.length > 1 ? `Page ${i + 1}\n` : "";
      return label + exportClipboard(slice.fields, slice.table);
    })
    .join("\n\n");
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
