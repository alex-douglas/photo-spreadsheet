import { PDFParse } from "pdf-parse";

/**
 * Heuristic page count when full PDF.js parse fails (bundling, native deps, or odd PDFs).
 * Scans the raw file for /Type /Page markers (excluding /Pages).
 */
export function estimatePdfPageCount(buffer: Buffer): number {
  const maxScan = Math.min(buffer.length, 6 * 1024 * 1024);
  const s = buffer.toString("latin1", 0, maxScan);
  const pageObjs = s.match(/\/Type\s*\/Page([^s]|$)/g);
  if (pageObjs && pageObjs.length > 0) {
    return Math.min(500, pageObjs.length);
  }
  let maxCount = 0;
  const re = /\/Count\s+(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n > maxCount && n < 50_000) maxCount = n;
  }
  if (maxCount > 0) return Math.min(500, maxCount);
  return 1;
}

export async function getPdfPageCount(buffer: Buffer): Promise<number> {
  try {
    const parser = new PDFParse({ data: buffer });
    try {
      const info = await parser.getInfo();
      const n = info.total;
      if (typeof n === "number" && n > 0) return Math.min(500, n);
    } finally {
      await parser.destroy();
    }
  } catch (e) {
    console.warn("[pdf-page-count] PDFParse failed, using heuristic", e);
  }
  return estimatePdfPageCount(buffer);
}
