"use client";

import { useState } from "react";
import { Check, ClipboardCopy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { copyTextToClipboard } from "@/lib/clipboard-utils";
import {
  exportCSV,
  exportCSVFromPageSlices,
  exportClipboard,
  exportClipboardFromPageSlices,
  exportJSON,
  exportJSONFromPageSlices,
  downloadFile,
  type ExportPageSlice,
} from "@/lib/export-utils";

interface ExportButtonsProps {
  fields: Record<string, string>;
  table?: string[][];
  /** When set with more than one slice, CSV/JSON/Copy merge all pages. */
  pageSlices?: ExportPageSlice[];
  docType: string;
  /** Visual variant: "default" for full-size, "compact" for inline per-page use. */
  variant?: "default" | "compact";
  /** Label prefix for the buttons (e.g. "Page 1"). */
  label?: string;
}

export function ExportButtons({ fields, table, pageSlices, docType, variant = "default", label }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const slicesForExport: ExportPageSlice[] =
    pageSlices && pageSlices.length > 0
      ? pageSlices
      : [{ fields, ...(table?.length ? { table } : {}) }];

  function handleCSV() {
    const csv =
      slicesForExport.length > 1
        ? exportCSVFromPageSlices(slicesForExport)
        : exportCSV(slicesForExport[0]!.fields, slicesForExport[0]!.table);
    const suffix = label ? `-${label.toLowerCase().replace(/\s+/g, "-")}` : "";
    downloadFile(csv, `${docType}-extract${suffix}.csv`, "text/csv");
  }

  function handleJSON() {
    const json =
      slicesForExport.length > 1
        ? exportJSONFromPageSlices(slicesForExport)
        : exportJSON(slicesForExport[0]!.fields, slicesForExport[0]!.table);
    const suffix = label ? `-${label.toLowerCase().replace(/\s+/g, "-")}` : "";
    downloadFile(json, `${docType}-extract${suffix}.json`, "application/json");
  }

  async function handleClipboard() {
    const text =
      slicesForExport.length > 1
        ? exportClipboardFromPageSlices(slicesForExport)
        : exportClipboard(slicesForExport[0]!.fields, slicesForExport[0]!.table);
    const ok = await copyTextToClipboard(text);
    if (!ok) {
      alert(
        "Could not copy to the clipboard. Use CSV or JSON export, or open the app over HTTPS or localhost."
      );
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isCompact = variant === "compact";
  const btnSize = isCompact ? "xs" : "sm";
  const iconSize = isCompact ? "size-3" : "size-4";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && (
        <span className="text-xs font-medium text-muted-foreground">{label}:</span>
      )}
      <Button type="button" variant="outline" size={btnSize} onClick={handleCSV} className="gap-1.5">
        <Download className={iconSize} aria-hidden />
        CSV
      </Button>
      <Button type="button" variant="outline" size={btnSize} onClick={handleJSON} className="gap-1.5">
        <Download className={iconSize} aria-hidden />
        JSON
      </Button>
      <Button type="button" variant={isCompact ? "outline" : "default"} size={btnSize} onClick={handleClipboard} className="gap-1.5">
        {copied ? (
          <>
            <Check className={iconSize} aria-hidden />
            Copied
          </>
        ) : (
          <>
            <ClipboardCopy className={iconSize} aria-hidden />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}
