import { NextRequest, NextResponse } from "next/server";
import { getGemini } from "@/lib/gemini";
import { getPdfPageCount } from "@/lib/pdf-page-count";
import {
  creditCostForUpload,
  decrementCredits,
  getAvailableCredits,
  getSupabaseAdmin,
} from "@/lib/credits-server";
import {
  CLASSIFICATION_PROMPT,
  EXTRACTION_PROMPTS,
  DocType,
} from "@/lib/extraction-prompts";
import { splitPdfPages } from "@/lib/pdf-split";

const VALID_TYPES: DocType[] = [
  "w2",
  "receipt",
  "invoice",
  "business_card",
  "table",
  "other",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, deviceId, linkedEmail } = body as {
      image?: string;
      deviceId?: string;
      linkedEmail?: string | null;
    };

    const walletDeviceId =
      typeof deviceId === "string" && deviceId.length > 0 ? deviceId : undefined;

    if (!image) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (supabase && !walletDeviceId) {
      return NextResponse.json(
        { error: "deviceId is required when credits are enforced server-side." },
        { status: 400 }
      );
    }

    const dataUrlMatch = image.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1].toLowerCase();
      base64Data = dataUrlMatch[2];
    }

    const allowedMime =
      /^image\/(png|jpe?g|webp|gif|heic|heif|bmp|tiff?)$/i.test(mimeType) ||
      mimeType === "application/pdf";
    if (!allowedMime) {
      return NextResponse.json(
        { error: "Unsupported file type. Use an image or PDF." },
        { status: 400 }
      );
    }

    const estimatedSize = (base64Data.length * 3) / 4;
    if (estimatedSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Please use a file under 10MB." },
        { status: 400 }
      );
    }

    let pdfPageCount: number | undefined;
    if (mimeType === "application/pdf") {
      try {
        pdfPageCount = await getPdfPageCount(Buffer.from(base64Data, "base64"));
      } catch (e) {
        console.warn("[extract] pdf page count failed", e);
      }
    }

    const creditCost = creditCostForUpload(mimeType, pdfPageCount);

    if (supabase && walletDeviceId) {
      const available = await getAvailableCredits(
        supabase,
        walletDeviceId,
        linkedEmail ?? undefined
      );
      if (available < creditCost) {
        return NextResponse.json(
          {
            error: "Not enough credits",
            creditCost,
            creditsAvailable: available,
          },
          { status: 402 }
        );
      }
    }

    const ai = getGemini();

    let classifyMime = mimeType;
    let classifyData = base64Data;

    if (pdfPageCount && pdfPageCount > 1) {
      try {
        const { splitPdfPages: split } = await import("@/lib/pdf-split");
        const pages = await split(Buffer.from(base64Data, "base64"));
        if (pages.length > 0) {
          classifyMime = "application/pdf";
          classifyData = pages[0]!.toString("base64");
        }
      } catch (e) {
        console.warn("[extract] could not split PDF for classification, using full doc", e);
      }
    }

    const classifyResult = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: CLASSIFICATION_PROMPT },
            { inlineData: { mimeType: classifyMime, data: classifyData } },
          ],
        },
      ],
    });

    const rawType = (classifyResult.text ?? "other").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    const docType: DocType = VALID_TYPES.includes(rawType as DocType)
      ? (rawType as DocType)
      : "other";

    console.info("[extract] classified document type", {
      rawClassification: classifyResult.text?.trim(),
      rawType,
      docType,
      mimeType,
      pdfPageCount,
      creditCost,
    });

    function parseExtractJson(text: string): { fields: Record<string, string>; table?: string[][] } {
      try {
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
        const obj = JSON.parse(jsonStr);
        return { fields: obj.fields ?? {}, table: obj.table };
      } catch {
        return { fields: { raw_text: text } };
      }
    }

    function maskW2Ssn(fields: Record<string, string>) {
      if (docType !== "w2" || !fields.employee_ssn) return;
      const ssn = fields.employee_ssn.replace(/\D/g, "");
      if (ssn.length >= 4) fields.employee_ssn = `***-**-${ssn.slice(-4)}`;
    }

    const isMultiPage = Boolean(pdfPageCount && pdfPageCount > 1);
    let pageSlices: { fields: Record<string, string>; table?: string[][] }[] | null = null;
    let fieldsOut: Record<string, string> = {};
    let tableOut: string[][] | undefined;

    if (isMultiPage) {
      const pdfBuffer = Buffer.from(base64Data, "base64");
      const singlePagePdfs = await splitPdfPages(pdfBuffer);
      console.info(`[extract] split PDF into ${singlePagePdfs.length} single-page PDFs`);

      pageSlices = [];
      const prompt = EXTRACTION_PROMPTS[docType];

      for (let i = 0; i < singlePagePdfs.length; i++) {
        const pageB64 = singlePagePdfs[i]!.toString("base64");
        console.info(`[extract] extracting page ${i + 1}/${singlePagePdfs.length}`);

        const pageResult = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-preview",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inlineData: { mimeType: "application/pdf", data: pageB64 } },
              ],
            },
          ],
        });

        const slice = parseExtractJson(pageResult.text ?? "{}");
        maskW2Ssn(slice.fields);
        pageSlices.push(slice);
      }
      fieldsOut = pageSlices[0]!.fields;
    } else {
      const extractResult = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: [
          {
            role: "user",
            parts: [
              { text: EXTRACTION_PROMPTS[docType] },
              { inlineData: { mimeType, data: base64Data } },
            ],
          },
        ],
      });
      const parsed = parseExtractJson(extractResult.text ?? "{}");
      maskW2Ssn(parsed.fields);
      fieldsOut = parsed.fields;
      tableOut = parsed.table;
    }

    console.info("[extract] result", {
      docType,
      pdfPageCount,
      isMultiPage,
      pageSlices: pageSlices?.length ?? 0,
    });

    let creditsRemaining: number | null = null;
    let creditsSource: "supabase" | "local" = "local";

    if (supabase && walletDeviceId) {
      try {
        const { creditsRemaining: rem } = await decrementCredits(
          supabase,
          walletDeviceId,
          linkedEmail ?? undefined,
          creditCost
        );
        creditsRemaining = rem;
        creditsSource = "supabase";
      } catch (e) {
        console.error("[extract] debit failed after successful AI run", e);
        return NextResponse.json(
          { error: "Could not finalize credits. Please contact support." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      type: docType,
      fields: fieldsOut,
      table: tableOut,
      ...(pageSlices && pageSlices.length > 0 ? { pages: pageSlices } : {}),
      meta: {
        pdfPageCount,
        multiPagePdf: Boolean(pdfPageCount && pdfPageCount > 1),
        creditCost,
      },
      creditCost,
      creditsCharged: creditCost,
      creditsRemaining,
      creditsSource,
    });
  } catch (error) {
    console.error("Extraction error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
