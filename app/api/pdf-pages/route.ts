import { NextRequest, NextResponse } from "next/server";
import { getPdfPageCount } from "@/lib/pdf-page-count";
import { bufferFromPdfDataUrl } from "@/lib/pdf-data-url";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dataUrl } = body as { dataUrl?: string };

    if (!dataUrl || typeof dataUrl !== "string") {
      return NextResponse.json({ error: "No dataUrl" }, { status: 400 });
    }

    const buf = bufferFromPdfDataUrl(dataUrl);
    if (!buf) {
      return NextResponse.json({ error: "Not a PDF data URL or invalid base64" }, { status: 400 });
    }
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ error: "PDF too large" }, { status: 400 });
    }

    const pageCount = await getPdfPageCount(buf);
    return NextResponse.json({ pageCount });
  } catch (e) {
    console.error("[pdf-pages]", e);
    return NextResponse.json({ error: "Could not read PDF" }, { status: 500 });
  }
}
