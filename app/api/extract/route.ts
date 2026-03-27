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
  DocType,
  getExtractionUserPrompt,
} from "@/lib/extraction-prompts";

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

    const classifyResult = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: CLASSIFICATION_PROMPT },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      ],
    });

    const rawType = (classifyResult.text ?? "other").trim().toLowerCase().replace(/[^a-z_]/g, "");
    const docType: DocType = VALID_TYPES.includes(rawType as DocType)
      ? (rawType as DocType)
      : "other";

    console.info("[extract] classified document type", {
      docType,
      mimeType,
      pdfPageCount,
      creditCost,
    });

    const extractionPrompt = getExtractionUserPrompt(docType, pdfPageCount);

    const extractResult = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: extractionPrompt },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      ],
    });

    const extractText = extractResult.text ?? "{}";

    type ParsedPage = {
      page_number?: number;
      fields?: Record<string, string>;
      table?: string[][];
    };
    let parsed: {
      fields?: Record<string, string>;
      table?: string[][];
      pages?: ParsedPage[];
    };
    try {
      const jsonMatch = extractText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : extractText.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = {
        fields: { raw_text: extractText },
      };
    }

    function maskW2Ssn(fields: Record<string, string>) {
      if (docType !== "w2" || !fields.employee_ssn) return;
      const ssn = fields.employee_ssn.replace(/\D/g, "");
      if (ssn.length >= 4) fields.employee_ssn = `***-**-${ssn.slice(-4)}`;
    }

    const rawPages = Array.isArray(parsed.pages) ? parsed.pages : [];
    const sortedPages =
      pdfPageCount && pdfPageCount > 1 && rawPages.length > 0
        ? [...rawPages].sort(
            (a, b) => (a.page_number ?? 0) - (b.page_number ?? 0)
          )
        : [];

    const normalizedPages =
      sortedPages.length > 0
        ? sortedPages.map((p) => ({
            fields: { ...(p.fields ?? {}) },
            table: p.table,
          }))
        : null;

    if (normalizedPages) {
      for (const slice of normalizedPages) maskW2Ssn(slice.fields);
    }

    if (parsed.fields) maskW2Ssn(parsed.fields);

    const multiPageSlices =
      pdfPageCount &&
      pdfPageCount > 1 &&
      normalizedPages &&
      normalizedPages.length > 1
        ? normalizedPages
        : null;

    const fieldsOut =
      multiPageSlices && multiPageSlices.length > 0
        ? multiPageSlices[0]!.fields
        : normalizedPages?.length === 1
          ? normalizedPages[0]!.fields
          : (parsed.fields ?? {});

    const tableOut = multiPageSlices
      ? undefined
      : normalizedPages?.length === 1
        ? normalizedPages[0]!.table
        : parsed.table;

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
      ...(multiPageSlices ? { pages: multiPageSlices } : {}),
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
