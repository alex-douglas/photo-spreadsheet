"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, FileText, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { clearHistory, loadHistory, removeHistoryEntry, type HistoryEntry } from "@/lib/history-storage";

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function fileCountLabel(n: number): string {
  if (n === 1) return "1 file uploaded";
  return `${n} files uploaded`;
}

interface HistoryGroup {
  batchGroupId: string | null;
  entries: HistoryEntry[];
  label: string;
  when: string;
}

function groupEntries(items: HistoryEntry[]): HistoryGroup[] {
  const groups: HistoryGroup[] = [];
  const batchMap = new Map<string, HistoryEntry[]>();
  const standalone: HistoryEntry[] = [];

  for (const entry of items) {
    const batchId = entry.meta?.batchGroupId;
    if (batchId) {
      const arr = batchMap.get(batchId) ?? [];
      arr.push(entry);
      batchMap.set(batchId, arr);
    } else {
      standalone.push(entry);
    }
  }

  for (const entry of standalone) {
    groups.push({
      batchGroupId: null,
      entries: [entry],
      label: entry.docLabel,
      when: entry.savedAt,
    });
  }

  for (const [batchId, entries] of batchMap) {
    const sorted = [...entries].sort(
      (a, b) => (a.meta?.batchIndex ?? 0) - (b.meta?.batchIndex ?? 0)
    );
    groups.push({
      batchGroupId: batchId,
      entries: sorted,
      label: fileCountLabel(sorted.length),
      when: sorted[0]!.savedAt,
    });
  }

  groups.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  return groups;
}

function SingleEntryRow({
  entry,
  onRemove,
}: {
  entry: HistoryEntry;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
      <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{entry.docLabel}</p>
        <p className="text-xs text-muted-foreground">
          {entry.type.replace(/_/g, " ")}
          {entry.meta?.multiPagePdf && entry.meta.pdfPageCount
            ? ` · ${entry.meta.pdfPageCount} pages`
            : ""}
          {" · "}
          {formatWhen(entry.savedAt)}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <Link
          href={`/extraction/${entry.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 px-2")}
        >
          Open
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label="Remove from history"
          onClick={onRemove}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  );
}

function BatchGroupRow({
  group,
  onRemoveEntry,
}: {
  group: HistoryGroup;
  onRemoveEntry: (id: string) => void;
}) {
  return (
    <li className="space-y-1.5 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
      <div className="flex items-start gap-2">
        <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{group.label}</p>
          <p className="text-xs text-muted-foreground">{formatWhen(group.when)}</p>
        </div>
      </div>
      <ul className="space-y-1 pl-6">
        {group.entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
          >
            <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-foreground">{entry.docLabel}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {entry.type.replace(/_/g, " ")}
              {entry.meta?.multiPagePdf && entry.meta.pdfPageCount
                ? ` · ${entry.meta.pdfPageCount}p`
                : ""}
            </span>
            <div className="flex shrink-0 gap-1">
              <Link
                href={`/extraction/${entry.id}`}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 px-2 text-xs")}
              >
                Open
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="size-7 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${entry.docLabel}`}
                onClick={() => onRemoveEntry(entry.id)}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function HistoryPanel() {
  const [items, setItems] = useState<HistoryEntry[]>(() => loadHistory());

  const refresh = useCallback(() => {
    setItems(loadHistory());
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "photosheet.history.v1") setItems(loadHistory());
    }
    function onLocal() {
      setItems(loadHistory());
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("photosheet-history", onLocal);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("photosheet-history", onLocal);
    };
  }, []);

  const groups = useMemo(() => groupEntries(items), [items]);

  if (items.length === 0) {
    return (
      <Card className="ring-border">
        <CardHeader>
          <CardTitle className="text-base">Recent extractions</CardTitle>
          <CardDescription>
            Saved scans will appear here. Data stays in this browser only — clearing site data or switching
            devices removes it. Not a backup.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function handleRemove(id: string) {
    removeHistoryEntry(id);
    refresh();
  }

  return (
    <Card className="ring-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent extractions</CardTitle>
        <CardDescription className="text-xs leading-relaxed">
          Stored only in this browser&apos;s local storage. Clearing cookies/site data, private browsing, or
          another device means this list (and saved results) are gone. We do not sync extraction results to a
          server — only credit balances can be tied to email in Supabase when you purchase or link.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[min(420px,55vh)] pr-3">
          <ul className="space-y-2">
            {groups.map((group) =>
              group.entries.length === 1 && !group.batchGroupId ? (
                <SingleEntryRow
                  key={group.entries[0]!.id}
                  entry={group.entries[0]!}
                  onRemove={() => handleRemove(group.entries[0]!.id)}
                />
              ) : (
                <BatchGroupRow
                  key={group.batchGroupId ?? group.entries[0]!.id}
                  group={group}
                  onRemoveEntry={handleRemove}
                />
              )
            )}
          </ul>
        </ScrollArea>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => {
            if (confirm("Remove all saved extractions from this browser?")) {
              clearHistory();
              refresh();
            }
          }}
        >
          Clear all history
        </Button>
      </CardContent>
    </Card>
  );
}
