/** Decode a data URL into a buffer if it looks like a PDF (%PDF- magic). */
export function bufferFromPdfDataUrl(dataUrl: string): Buffer | null {
  const trimmed = dataUrl.trim();
  const marker = ";base64,";
  const i = trimmed.indexOf(marker);
  if (i === -1) return null;
  const b64 = trimmed.slice(i + marker.length).replace(/\s/g, "");
  let buf: Buffer;
  try {
    buf = Buffer.from(b64, "base64");
  } catch {
    return null;
  }
  if (buf.length < 5) return null;
  const head = buf.subarray(0, 5).toString("ascii");
  if (head !== "%PDF-") return null;
  return buf;
}
