import { NextRequest, NextResponse } from "next/server";
import { getGemini } from "@/lib/gemini";
import {
  CLASSIFICATION_PROMPT,
  EXTRACTION_PROMPTS,
  DocType,
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
    const { image } = body as { image?: string };

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Strip data URL prefix if present
    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (base64Match) {
      mimeType = `image/${base64Match[1]}`;
      base64Data = base64Match[2];
    }

    // Check size (base64 is ~1.37x original)
    const estimatedSize = (base64Data.length * 3) / 4;
    if (estimatedSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Please use an image under 10MB." },
        { status: 400 }
      );
    }

    const ai = getGemini();

    // Step 1: Classify document type
    const classifyResult = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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

    // Step 2: Extract data with type-specific prompt
    const extractResult = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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

    const extractText = extractResult.text ?? "{}";

    // Parse JSON from response (handle markdown code blocks)
    let parsed: { fields?: Record<string, string>; table?: string[][] };
    try {
      const jsonMatch = extractText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : extractText.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, return raw text as a field
      parsed = {
        fields: { raw_text: extractText },
      };
    }

    // Mask SSN in W2 results
    if (docType === "w2" && parsed.fields?.employee_ssn) {
      const ssn = parsed.fields.employee_ssn.replace(/\D/g, "");
      if (ssn.length >= 4) {
        parsed.fields.employee_ssn = `***-**-${ssn.slice(-4)}`;
      }
    }

    return NextResponse.json({
      type: docType,
      fields: parsed.fields ?? {},
      table: parsed.table,
    });
  } catch (error) {
    console.error("Extraction error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
