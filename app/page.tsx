"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { Processing } from "@/components/processing";
import { ResultsTable } from "@/components/results-table";
import type { DocType } from "@/lib/extraction-prompts";

interface ExtractionResult {
  type: DocType;
  fields: Record<string, string>;
  table?: string[][];
}

const USE_CASES = [
  { icon: "🧾", title: "Receipts", desc: "Line items, totals, tax — all extracted" },
  { icon: "📄", title: "W-2 Forms", desc: "Wages, withholdings, employer info" },
  { icon: "📑", title: "Invoices", desc: "Vendor details, line items, due dates" },
  { icon: "💼", title: "Business Cards", desc: "Contact info ready for your CRM" },
  { icon: "📊", title: "Tables", desc: "Any tabular data from photos" },
  { icon: "📋", title: "Any Document", desc: "AI auto-detects the document type" },
];

export default function Home() {
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleUpload = async (base64: string) => {
    setState("processing");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Extraction failed");
      }

      setResult(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-sm">
              PS
            </div>
            <span className="font-semibold text-lg">PhotoSheet</span>
          </div>
          {state === "done" && (
            <button
              onClick={handleReset}
              className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              ← New Scan
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        {state === "idle" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Photo → Spreadsheet Data
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Snap a photo of any document and get clean, structured data you
                can edit and export instantly.
              </p>
            </div>

            {/* Upload */}
            <UploadZone onUpload={handleUpload} />

            {/* Use Cases Grid */}
            <div>
              <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 text-center">
                Works with any document
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {USE_CASES.map((uc) => (
                  <div
                    key={uc.title}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center hover:border-green-200 dark:hover:border-green-800 transition-colors"
                  >
                    <div className="text-2xl mb-1.5">{uc.icon}</div>
                    <div className="font-medium text-sm">{uc.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {uc.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 text-center">
                How it works
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm mb-2">
                    1
                  </div>
                  <h3 className="font-medium">Upload or Snap</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Drop an image or take a photo with your phone camera
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm mb-2">
                    2
                  </div>
                  <h3 className="font-medium">AI Extracts Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Google Gemini detects the document type and pulls every field
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm mb-2">
                    3
                  </div>
                  <h3 className="font-medium">Edit & Export</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tweak any value, then download CSV, JSON, or copy to clipboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === "processing" && (
          <div className="space-y-6">
            <UploadZone onUpload={handleUpload} disabled />
            <Processing />
          </div>
        )}

        {state === "done" && result && (
          <div className="space-y-6">
            <UploadZone onUpload={handleUpload} disabled />
            <ResultsTable
              type={result.type}
              fields={result.fields}
              table={result.table}
            />
          </div>
        )}

        {state === "error" && (
          <div className="space-y-6">
            <UploadZone onUpload={handleUpload} />
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-center">
              <p className="text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
              <button
                onClick={handleReset}
                className="mt-3 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 mt-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>
            PhotoSheet — AI-powered document data extraction.
            <br className="sm:hidden" />{" "}
            Your images are processed and never stored.
          </p>
        </div>
      </footer>
    </div>
  );
}
