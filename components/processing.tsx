"use client";

export function Processing() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-in fade-in duration-300">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-4 border-primary/40 border-b-transparent"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">Extracting spreadsheet-ready data…</p>
        <p className="mt-1 text-sm text-muted-foreground">Detecting document type, tables, and fields</p>
      </div>
    </div>
  );
}
