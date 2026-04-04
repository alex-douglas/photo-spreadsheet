import { PDFDocument } from "pdf-lib";

/** Split a multi-page PDF buffer into an array of single-page PDF buffers. */
export async function splitPdfPages(pdfBuffer: Buffer): Promise<Buffer[]> {
  const srcDoc = await PDFDocument.load(pdfBuffer);
  const pageCount = srcDoc.getPageCount();

  const pages: Buffer[] = [];
  for (let i = 0; i < pageCount; i++) {
    const singleDoc = await PDFDocument.create();
    const [copied] = await singleDoc.copyPages(srcDoc, [i]);
    singleDoc.addPage(copied);
    const bytes = await singleDoc.save();
    pages.push(Buffer.from(bytes));
  }

  return pages;
}
