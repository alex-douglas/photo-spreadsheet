"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upload as blobUpload } from "@vercel/blob/client";

import { SeoFaqSection } from "@/components/seo-faq-section";
import { SiteShell } from "@/components/site-shell";
import { UploadZone, type StagedUploadItem } from "@/components/upload-zone";
import { Processing } from "@/components/processing";
import { useCredits } from "@/components/credits-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME, SITE_URL } from "@/lib/brand";
import { appendHistory } from "@/lib/history-storage";
import { generateId } from "@/lib/uuid";

const USE_CASES = [
  {
    icon: "🧾",
    title: "Receipts",
    desc: "Turn pictures of receipts into expense spreadsheets. Extracts line items, taxes, and totals.",
  },
  {
    icon: "📄",
    title: "W-2 Forms",
    desc: "Scan W-2s to spreadsheets. Categorizes wages, withholdings, and employer data for tax season.",
  },
  {
    icon: "📑",
    title: "Invoices",
    desc: "Automate invoice data entry. Pulls vendor details, due dates, and line items into structured formats.",
  },
  {
    icon: "💼",
    title: "Business Cards",
    desc: "Digitize business cards to CSV. Parse names, emails, and phone numbers for your CRM.",
  },
  {
    icon: "📊",
    title: "Data Tables",
    desc: "Convert image to table. Perfect for screenshots, price lists, or printed reports.",
  },
  {
    icon: "📝",
    title: "Handwritten Notes",
    desc: "Transcribe handwritten lists and inventories into editable spreadsheet rows.",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  description:
    "An AI-powered web app that converts images, photos, and PDFs into editable spreadsheet data and CSV files. Ideal for receipts, tables, W-2s, and invoices.",
} as const;

function creditCostForItem(item: StagedUploadItem): number {
  if (item.isPdf) return Math.max(1, item.pageCount ?? 1);
  return 1;
}

function docLabelFromFileName(fileName: string): string {
  const base = fileName.replace(/\.[^/.]+$/, "").trim();
  return (base.length > 0 ? base : fileName).slice(0, 80);
}

export default function HomePage() {
  const router = useRouter();
  const { credits, deviceId, linkedEmail, applyExtractResult, openBuyCredits } = useCredits();
  const [state, setState] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");
  const [scanKey, setScanKey] = useState(0);
  const [hasStagedFile, setHasStagedFile] = useState(false);

  async function handleAnalyzeItems(items: StagedUploadItem[]): Promise<boolean> {
    const totalCost = items.reduce((sum, item) => sum + creditCostForItem(item), 0);
    if (credits < totalCost) {
      openBuyCredits(
        `These ${items.length} file(s) need ${totalCost} credits total. You have ${credits}. Buy more or link an email with a balance.`
      );
      return false;
    }

    setState("processing");
    setError("");

    try {
      let lastEntryId: string | null = null;
      const batchGroupId = items.length > 1 ? generateId("batch") : undefined;

      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const cost = creditCostForItem(item);

        let blobUrlToUse: string;
        try {
          const blob = await blobUpload(item.fileName, item.file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });
          blobUrlToUse = blob.url;
        } catch (uploadErr) {
          throw new Error(
            `File upload failed for "${item.fileName}": ${uploadErr instanceof Error ? uploadErr.message : "unknown error"}`
          );
        }

        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blobUrl: blobUrlToUse,
            deviceId,
            linkedEmail,
          }),
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("[extract] non-JSON response", res.status, text.slice(0, 500));
          throw new Error(
            `Server error (${res.status}) processing "${item.fileName}". Please try again.`
          );
        } else {
          data = await res.json();
        }

        if (res.status === 402) {
          openBuyCredits(
            `Not enough credits to continue (need ${data.creditCost ?? cost}, have ${data.creditsAvailable ?? credits}). Earlier files were already processed.`
          );
          setState("idle");
          return false;
        }

        if (!res.ok) {
          throw new Error(String(data.error || `Extraction failed for "${item.fileName}"`));
        }

        applyExtractResult({
          creditCost: data.creditCost ?? cost,
          creditsRemaining: data.creditsRemaining,
          creditsSource: data.creditsSource ?? "local",
        });

        const pages =
          Array.isArray(data.pages) && data.pages.length > 0 ? data.pages : undefined;

        const entry = appendHistory({
          docLabel: docLabelFromFileName(item.fileName),
          type: data.type,
          fields: data.fields,
          table: pages ? undefined : data.table,
          pages,
          meta: {
            pdfPageCount: data.meta?.pdfPageCount,
            multiPagePdf: data.meta?.multiPagePdf,
            creditCost: data.creditCost,
            ...(batchGroupId
              ? { batchGroupId, batchIndex: i, batchSize: items.length }
              : {}),
          },
        });
        lastEntryId = entry.id;
      }

      if (lastEntryId) {
        setState("idle");
        router.push(`/extraction/${lastEntryId}`);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
      return false;
    }
  }

  function handleReset() {
    setState("idle");
    setError("");
    setHasStagedFile(false);
    setScanKey((k) => k + 1);
  }

  const uploaderDisabled = state === "processing";

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-10 px-4 py-8">
        <div className="space-y-3 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Convert Any Image or PDF to a Spreadsheet Instantly
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Extract tables, receipts, W-2s, and invoices from photos and PDFs. Export clean, structured data to CSV,
            Excel, or Google Sheets in seconds.
          </p>
        </div>

        <div className="space-y-6">
          <UploadZone
            key={scanKey}
            onAnalyzeItems={handleAnalyzeItems}
            disabled={uploaderDisabled}
            onStagedChange={setHasStagedFile}
          />

          {state === "processing" && <Processing />}

          {state === "error" && (
            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{error}</p>
                <Separator className="bg-destructive/20" />
                <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {!hasStagedFile && (
          <p className="-mt-6 text-center text-[0.65rem] leading-relaxed text-muted-foreground/70">
            PhotoToSheet uses AI for data extraction. Always verify extracted data for accuracy.
            Not a tax preparation or accounting service.{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Learn more
            </a>
          </p>
        )}

        {!hasStagedFile && (
          <section className="space-y-4" aria-labelledby="features-heading">
            <h2
              id="features-heading"
              className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Receipts, W-2s, tables &amp; more
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {USE_CASES.map((uc) => (
                <Card
                  key={uc.title}
                  size="sm"
                  className="py-3 text-center ring-border transition-colors hover:border-primary/30"
                >
                  <CardHeader className="px-3 pb-1 pt-0">
                    <div className="text-2xl" aria-hidden>
                      {uc.icon}
                    </div>
                    <h3 className="font-heading text-sm font-medium leading-snug text-card-foreground">{uc.title}</h3>
                    <CardDescription className="text-xs">{uc.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        )}

        {!hasStagedFile && (
          <section aria-labelledby="how-heading">
            <Card className="bg-muted/40 ring-border">
              <CardHeader className="text-center">
                <h2
                  id="how-heading"
                  className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  How it works
                </h2>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-3 sm:gap-8">
                <div className="text-center">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    1
                  </div>
                  <h3 className="font-medium text-foreground">
                    <span className="sm:hidden">Upload or snap</span>
                    <span className="hidden sm:inline">Upload or paste</span>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="sm:hidden">Take a photo of a document or upload from your camera roll.</span>
                    <span className="hidden sm:inline">Drop a screenshot, upload a scanned PDF, or snap a photo with your phone. Clipboard paste works too (Ctrl+V / ⌘V).</span>
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    2
                  </div>
                  <h3 className="font-medium text-foreground">AI data extraction</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our Gemini-powered AI identifies the document type and formats tabular data for spreadsheets.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    3
                  </div>
                  <h3 className="font-medium text-foreground">Edit &amp; export</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review structured fields and tables, then download CSV or JSON, or copy directly into Excel and
                    Google Sheets.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {!hasStagedFile && <SeoFaqSection />}
      </main>
    </SiteShell>
  );
}
