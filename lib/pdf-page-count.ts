import { PDFDocument } from "pdf-lib";

export async function getPdfPageCount(buffer: Buffer): Promise<number> {
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch (e) {
    console.warn("[pdf-page-count] pdf-lib failed, using heuristic", e);
  }
  return estimatePdfPageCount(buffer);
}

/**
 * Heuristic fallback: scans raw PDF bytes for /Type /Page markers.
 */
function estimatePdfPageCount(buffer: Buffer): number {
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
    const n = parseInt(m[1]!, 10);
    if (Number.isFinite(n) && n > maxCount && n < 50_000) maxCount = n;
  }
  if (maxCount > 0) return Math.min(500, maxCount);
  return 1;
}
