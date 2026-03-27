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
}

export function ExportButtons({ fields, table, pageSlices, docType }: ExportButtonsProps) {
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
    downloadFile(csv, `${docType}-extract.csv`, "text/csv");
  }

  function handleJSON() {
    const json =
      slicesForExport.length > 1
        ? exportJSONFromPageSlices(slicesForExport)
        : exportJSON(slicesForExport[0]!.fields, slicesForExport[0]!.table);
    downloadFile(json, `${docType}-extract.json`, "application/json");
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

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={handleCSV} className="gap-1.5">
        <Download className="size-4" aria-hidden />
        CSV
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={handleJSON} className="gap-1.5">
        <Download className="size-4" aria-hidden />
        JSON
      </Button>
      <Button type="button" variant="default" size="sm" onClick={handleClipboard} className="gap-1.5">
        {copied ? (
          <>
            <Check className="size-4" aria-hidden />
            Copied
          </>
        ) : (
          <>
            <ClipboardCopy className="size-4" aria-hidden />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}
