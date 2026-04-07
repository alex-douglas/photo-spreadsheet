"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

import { SiteShell } from "@/components/site-shell";
import { ResultsTable } from "@/components/results-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBatchNavigation, getHistoryEntryById } from "@/lib/history-storage";

export default function ExtractionClient({ id }: { id: string }) {
  const entry = useMemo(() => getHistoryEntryById(id) ?? null, [id]);
  const batchNav = useMemo(() => getBatchNavigation(id), [id]);

  if (entry === null) {
    return (
      <SiteShell>
        <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12">
          <Alert variant="destructive">
            <AlertTitle>Not found</AlertTitle>
            <AlertDescription>
              This extraction isn&apos;t in this browser&apos;s history anymore (or the link is wrong).
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className={cn(buttonVariants())}>
              New upload
            </Link>
            <Link href="/history" className={cn(buttonVariants({ variant: "outline" }))}>
              History
            </Link>
          </div>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{entry.docLabel}</h1>
            <p className="text-sm text-muted-foreground">
              Saved in this browser only — edits here don&apos;t sync elsewhere.
            </p>
          </div>
          {batchNav && (
            <div
              className="flex shrink-0 items-center gap-2 self-start rounded-lg border border-border bg-muted/30 px-2 py-1.5"
              role="navigation"
              aria-label="Documents from this upload"
            >
              {batchNav.prevId ? (
                <Link
                  href={`/extraction/${batchNav.prevId}`}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                  aria-label="Previous document in this batch"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </Link>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled
                  aria-label="Previous document in this batch"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </Button>
              )}
              <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-muted-foreground">
                {batchNav.index + 1} / {batchNav.total}
              </span>
              {batchNav.nextId ? (
                <Link
                  href={`/extraction/${batchNav.nextId}`}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                  aria-label="Next document in this batch"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled
                  aria-label="Next document in this batch"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Button>
              )}
            </div>
          )}
        </div>

        {entry.meta?.multiPagePdf && (
          <Alert>
            <AlertTitle>Multi-page PDF</AlertTitle>
            <AlertDescription>
              {entry.meta.pdfPageCount
                ? `This run used ${entry.meta.pdfPageCount} pages and charged ${entry.meta.creditCost ?? entry.meta.pdfPageCount} credits. `
                : ""}
              {entry.pages && entry.pages.length > 1
                ? "Results are split by page below; exports include every page."
                : "Full document text was sent to the model for extraction."}
            </AlertDescription>
          </Alert>
        )}

        {entry.type === "w2" && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                  Important: Verify Sensitive Data
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  SSNs are automatically masked, but this may not work in all cases.{" "}
                  <strong>Always verify that SSNs and other sensitive data are properly redacted</strong>{" "}
                  before sharing or exporting this data. Do not rely solely on auto-masking.
                </p>
              </div>
            </div>
          </div>
        )}

        <ResultsTable
          type={entry.type}
          fields={entry.fields}
          table={entry.table}
          pages={entry.pages}
        />
      </main>
    </SiteShell>
  );
}
